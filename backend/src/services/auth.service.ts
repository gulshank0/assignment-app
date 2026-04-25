import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../prisma/client.js";
import { AppError } from "../middleware/error.middleware.js";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/index.js";

// ─── Token helpers ────────────────────────────────────────────────────────────

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES as any) || "15m",
  });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES as any) || "7d",
  });
}

function refreshTokenExpiresAt(): Date {
  const days = parseInt(
    process.env.JWT_REFRESH_EXPIRES?.replace("d", "") ?? "7",
  );
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export async function signupService(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new AppError("Email already in use", 409);

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const tokenId = crypto.randomUUID();
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({ userId: user.id, tokenId });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  return { user, accessToken, refreshToken };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginService(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError("Invalid email or password", 401);

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new AppError("Invalid email or password", 401);

  const tokenId = crypto.randomUUID();
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({ userId: user.id, tokenId });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

export async function refreshTokenService(token: string) {
  let payload: RefreshTokenPayload;

  try {
    payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as RefreshTokenPayload;
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    // Clean up expired token
    if (stored) await prisma.refreshToken.delete({ where: { token } });
    throw new AppError("Refresh token expired or not found", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new AppError("User not found", 404);

  // Rotate: delete old token, issue new pair
  await prisma.refreshToken.delete({ where: { token } });

  const newTokenId = crypto.randomUUID();
  const newAccessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    userId: user.id,
    tokenId: newTokenId,
  });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutService(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

// ─── Get current user ─────────────────────────────────────────────────────────

export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
}
