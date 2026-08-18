import crypto from 'crypto';

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashToken(token: string): Promise<string> {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(token).digest('hex');
}

export function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
