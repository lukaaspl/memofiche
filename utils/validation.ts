import { CardType } from "@prisma/client";
import { z } from "zod";

// Temporary, due to some weird bug:
// "Excessive stack depth comparing types 'ZodNonEmptyArray<?>' and 'ZodNonEmptyArray<?>'"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const stringNumberSchema = z
  .string()
  .refine((value) => !Number.isNaN(Number(value)))
  .transform((value) => Number(value));

export const superMemoQualitySchema = z.number().min(0).max(5);

export const postDeckBodySchema = z.object({
  name: z.string(),
  tags: z.array(z.string()).default([]),
  isFavorite: z.boolean().optional().default(false),
});

export const postCardBodySchema = z.object({
  obverse: z.string(),
  reverse: z.string(),
  note: z.string().nullable(),
  type: z.enum([CardType.Normal, CardType.Reverse]).default(CardType.Normal),
  tags: z.array(z.string()).default([]),
});

export const updateProfileBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  website: z.string(),
  bio: z.string(),
});

export const postStudySessionBodySchema = z.object({
  studyTime: z.number(),
  avgTimePerCard: z.number(),
  avgRate: z.number(),
  studiedCards: z.number(),
  positiveCards: z.number(),
  negativeCards: z.number(),
  cardGrades: z.record(superMemoQualitySchema),
});

export const resetCardsQuerySchema = z.object({
  deckId: stringNumberSchema,
  mode: z.enum(["shallow", "deep"]).optional().default("shallow"),
});

const sortOrderSchema = z.enum(["asc", "desc"]).optional().default("asc");

export const sortDecksQuerySchema = z.object({
  sortBy: z
    .enum([
      "name",
      "cardsCount",
      "studyingCardsCount",
      "studyingCardsPercentage",
      "isFavorite",
      "createdAt",
      "updatedAt",
    ])
    .optional()
    .default("createdAt"),
  order: sortOrderSchema,
});

export const sortCardsQuerySchema = z.object({
  sortBy: z
    .enum(["type", "createdAt", "updatedAt"])
    .optional()
    .default("createdAt"),
  order: sortOrderSchema,
});

export const updateConfigSchema = z.object({
  advancedRatingControls: z.boolean(),
  darkTheme: z.boolean(),
});

export const resetPasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
