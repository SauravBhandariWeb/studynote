import type { Request, Response } from "express";
import app, { initializeApp } from "../server/index.js";

export default async function handler(
  req: Request,
  res: Response,
) {
  try {
    await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error("VERCEL API ERROR:", error);

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Internal server error",
    });
  }
}
