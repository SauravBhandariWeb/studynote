import dotenv from "dotenv";

dotenv.config();

// IMPORTANT:
// Routes ko static import mat karo.
// dotenv load hone ke BAAD dynamically import karenge.

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { authenticate } from "./middleware/auth.js";



const app = express();

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);



app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// START SERVER
// ============================================================

async function startServer() {
  try {
    // --------------------------------------------------------
    // Import routes AFTER dotenv.config()
    // --------------------------------------------------------

    const { default: authRoutes } =
      await import("./routes/auth.js");

    const { default: subjectRoutes } =
      await import("./routes/subjects.js");

    const { default: collectionRoutes } =
      await import("./routes/collections.js");

    const { default: lectureRoutes } =
      await import("./routes/lectures.js");

    const { default: lectureNoteRoutes } =
      await import("./routes/lectureNotes.js");

    const { default: noteRoutes } =
      await import("./routes/notes.js");

    const { default: sessionRoutes } =
      await import("./routes/sessions.js");

    const { default: goalRoutes } =
      await import("./routes/goals.js");

    const { default: dashboardRoutes } =
      await import("./routes/dashboard.js");

    // --------------------------------------------------------
    // Routes
    // --------------------------------------------------------

    app.use("/api/auth", authRoutes);

    app.use(
      "/api/subjects",
      authenticate,
      subjectRoutes,
    );

    app.use(
      "/api/collections",
      authenticate,
      collectionRoutes,
    );

    app.use(
      "/api/lectures",
      authenticate,
      lectureRoutes,
    );

    app.use(
      "/api/lecture-notes",
      authenticate,
      lectureNoteRoutes,
    );

    app.use(
      "/api/notes",
      authenticate,
      noteRoutes,
    );

    app.use(
      "/api/sessions",
      authenticate,
      sessionRoutes,
    );

    app.use(
      "/api/goals",
      authenticate,
      goalRoutes,
    );

    app.use(
      "/api/dashboard",
      authenticate,
      dashboardRoutes,
    );

    // --------------------------------------------------------
    // MongoDB
    // --------------------------------------------------------

    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("Connected to MongoDB");

    // --------------------------------------------------------
    // Start server
    // --------------------------------------------------------

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`,
      );
    });
  } catch (err) {
    console.error("SERVER STARTUP ERROR:", err);
    process.exit(1);
  }
}

startServer();
