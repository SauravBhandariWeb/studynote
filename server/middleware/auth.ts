import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        message: 'Not authenticated',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET is missing');

      res.status(500).json({
        message: 'Server authentication configuration error',
      });

      return;
    }

    const decoded = jwt.verify(
      token,
      secret,
    ) as { userId: string };

    if (!decoded?.userId) {
      res.status(401).json({
        message: 'Invalid token',
      });

      return;
    }

    const user = await User.findById(
      decoded.userId,
    ).select(
      '_id name email avatarUrl createdAt',
    );

    if (!user) {
      res.status(401).json({
        message: 'User not found',
      });

      return;
    }

    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.error(
      'AUTHENTICATION ERROR:',
      error,
    );

    res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}