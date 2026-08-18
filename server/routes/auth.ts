import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import { User } from "../models/User.js"
import type { AuthRequest } from "../middleware/auth.js"
import { generateResetToken, hashToken } from "../utils/helpers.js"

const router = Router()

const COOKIE_NAME = "token"
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

// ============================================================
// AUTH COOKIE
// ============================================================

function setAuthCookie(res: any, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

function clearAuthCookie(res: any): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
}

// ============================================================
// SMTP / GMAIL
// ============================================================

const SMTP_USER = process.env.SMTP_USER?.trim()
const SMTP_PASS = process.env.SMTP_PASS?.trim()
const SMTP_FROM = process.env.SMTP_FROM?.trim()




const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});





//register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email, and password are required",
      })
      return
    }

    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters",
      })
      return
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await User.findOne({
      email: normalizedEmail,
    })

    if (existing) {
      res.status(409).json({
        message: "An account with this email already exists",
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    )

    setAuthCookie(res, token)

    res.status(201).json({
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || undefined,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error("REGISTER ERROR:", err)

    res.status(500).json({
      message: "Registration failed",
    })
  }
})

// ============================================================
// LOGIN
// ============================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      })
      return
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password")

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      res.status(401).json({
        message: "Invalid email or password",
      })
      return
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    )

    setAuthCookie(res, token)

    res.json({
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || undefined,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error("LOGIN ERROR:", err)

    res.status(500).json({
      message: "Login failed",
    })
  }
})

// ============================================================
// LOGOUT
// ============================================================

router.post("/logout", (_req, res) => {
  clearAuthCookie(res)

  res.json({
    message: "Logged out",
  })
})

// ============================================================
// GET CURRENT USER
// ============================================================

router.get("/me", async (req: AuthRequest, res) => {
  try {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({
        message: "Not authenticated",
      })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
    }

    const user = await User.findById(decoded.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    )

    if (!user) {
      res.status(401).json({
        message: "User not found",
      })
      return
    }

    res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt,
    })
  } catch (err) {
    console.error("GET ME ERROR:", err)

    res.status(401).json({
      message: "Invalid or expired token",
    })
  }
})

// ============================================================
// UPDATE PROFILE
// ============================================================

router.patch("/me", async (req: AuthRequest, res) => {
  try {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({
        message: "Not authenticated",
      })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
    }

    const { name, avatarUrl } = req.body

    const updateData: Record<string, unknown> = {}

    if (name !== undefined) {
      updateData.name = String(name).trim()
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: updateData,
      },
      {
        new: true,
      },
    ).select("-password -resetPasswordToken -resetPasswordExpires")

    if (!user) {
      res.status(404).json({
        message: "User not found",
      })
      return
    }

    res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt,
    })
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err)

    res.status(500).json({
      message: "Failed to update profile",
    })
  }
})

// ============================================================
// FORGOT PASSWORD
// ============================================================

router.post("/forgot-password", async (req, res) => {
  const genericResponse = {
    message:
      "If an account with that email exists, a reset link has been sent.",
  }

  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({
        message: "Email is required",
      })
      return
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: normalizedEmail,
    })

    // Security: don't reveal whether account exists
    if (!user) {
      res.json(genericResponse)
      return
    }

    // --------------------------------------------------------
    // SMTP CONFIG CHECK
    // --------------------------------------------------------

    if (!SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      console.error("❌ SMTP CONFIGURATION ERROR:", {
        hasUser: Boolean(SMTP_USER),
        hasPassword: Boolean(SMTP_PASS),
        hasFrom: Boolean(SMTP_FROM),
      })

      res.status(500).json({
        message: "Email service is not configured correctly",
      })
      return
    }

    // --------------------------------------------------------
    // Generate reset token
    // --------------------------------------------------------

    const resetToken = generateResetToken()
    const hashedToken = await hashToken(resetToken)

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)

    await user.save()

    // --------------------------------------------------------
    // Create reset URL
    // --------------------------------------------------------

    const clientUrl = process.env.CLIENT_URL

    if (!clientUrl) {
      console.error("CLIENT_URL is missing")

      res.status(500).json({
        message: "Password reset is not configured correctly",
      })
      return
    }

    const resetUrl = `${clientUrl.replace(/\/$/, "")}/reset-password/${resetToken}`

    console.log("RESET URL:", resetUrl)

  

    // --------------------------------------------------------
    // SEND EMAIL
    // --------------------------------------------------------

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: user.email,
      subject: "Reset your StudyNote password",

      text: `
Hello ${user.name},

You requested a password reset for your StudyNote account.

Reset your password using this link:

${resetUrl}

This link expires in 1 hour.

If you did not request this password reset, you can safely ignore this email.

StudyNote
Your YouTube lecture companion
      `.trim(),

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>

<body
  style="
    margin:0;
    padding:30px 15px;
    background:#f8fafc;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      padding:32px;
      border-radius:16px;
      border:1px solid #e2e8f0;
    "
  >

    <div
      style="
        display:inline-block;
        background:#eff6ff;
        color:#2563eb;
        padding:8px 12px;
        border-radius:999px;
        font-size:12px;
        font-weight:bold;
        margin-bottom:20px;
      "
    >
      StudyNote
    </div>

    <h2
      style="
        margin:0 0 12px;
        color:#0f172a;
        font-size:24px;
      "
    >
      Reset your password
    </h2>

    <p style="color:#475569;font-size:15px;line-height:1.7;">
      Hello ${user.name},
    </p>

    <p style="color:#475569;font-size:15px;line-height:1.7;">
      You requested a password reset for your StudyNote account.
    </p>

    <p style="color:#475569;font-size:15px;line-height:1.7;">
      Click the button below to create a new password.
      This link will expire in <strong>1 hour</strong>.
    </p>

    <div style="margin:28px 0;">

      <a
        href="${resetUrl}"
        target="_blank"
        style="
          display:inline-block;
          background:#2563eb;
          color:#ffffff;
          padding:13px 22px;
          border-radius:10px;
          text-decoration:none;
          font-weight:bold;
          font-size:14px;
        "
      >
        Reset Password
      </a>

    </div>

    <p style="color:#64748b;font-size:13px;line-height:1.6;">
      If the button doesn't work, copy and paste this link
      into your browser:
    </p>

    <div
      style="
        background:#f8fafc;
        border-radius:8px;
        padding:12px;
        word-break:break-all;
      "
    >
      <a
        href="${resetUrl}"
        target="_blank"
        style="color:#2563eb;font-size:13px;"
      >
        ${resetUrl}
      </a>
    </div>

    <p
      style="
        color:#64748b;
        font-size:13px;
        line-height:1.6;
        margin-top:20px;
      "
    >
      If you didn't request this password reset,
      you can safely ignore this email.
    </p>

    <hr
      style="
        border:none;
        border-top:1px solid #e2e8f0;
        margin:28px 0;
      "
    />

    <p
      style="
        margin:0;
        color:#94a3b8;
        font-size:12px;
      "
    >
      StudyNote — Your YouTube lecture companion
    </p>

  </div>

</body>
</html>
      `,
    })

    console.log("✅ Password reset email sent:", info.messageId)

    res.json(genericResponse)
  } catch (err) {
    console.error("❌ FORGOT PASSWORD ERROR:", err)

    res.status(500).json({
      message:
        err instanceof Error ? err.message : "Failed to send reset email",
    })
  }
})

// ============================================================
// RESET PASSWORD
// ============================================================

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      res.status(400).json({
        message: "Token and password are required",
      })
      return
    }

    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters",
      })
      return
    }

    const hashedToken = await hashToken(token)

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    })

    if (!user) {
      res.status(400).json({
        message: "Reset token is invalid or has expired",
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.json({
      message: "Password has been reset successfully",
    })
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err)

    res.status(500).json({
      message: "Password reset failed",
    })
  }
})

export default router
