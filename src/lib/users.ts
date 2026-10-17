import "server-only";
import { db } from "@/lib/db";
import { isAdminTelegramId } from "@/lib/admin";
import { dbDateToTashkentString } from "@/lib/db-date";
import type { TelegramAuthUser } from "@/lib/telegram-auth";
import type { GoogleAuthUser } from "@/lib/google-auth";
import type { User } from "@/generated/prisma/client";

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  streak: number;
  bestStreak: number;
  /** Tashkent calendar day of the last recorded attempt, as "YYYY-MM-DD", or null. */
  lastActiveOn: string | null;
  shareActivity: boolean;
  isAdmin: boolean;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    photoUrl: user.photoUrl,
    streak: user.streak,
    bestStreak: user.bestStreak,
    lastActiveOn: dbDateToTashkentString(user.lastActiveOn),
    shareActivity: user.shareActivity,
    isAdmin: isAdminTelegramId(user.telegramId),
  };
}

export async function upsertTelegramUser(data: TelegramAuthUser): Promise<User> {
  return db.user.upsert({
    where: { telegramId: data.telegramId },
    create: {
      telegramId: data.telegramId,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      photoUrl: data.photoUrl,
    },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      photoUrl: data.photoUrl,
    },
  });
}

export async function upsertGoogleUser(data: GoogleAuthUser): Promise<User> {
  return db.user.upsert({
    where: { googleId: data.googleId },
    create: {
      googleId: data.googleId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      photoUrl: data.photoUrl,
    },
    update: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      photoUrl: data.photoUrl,
    },
  });
}
