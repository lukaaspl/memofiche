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
});

export const postCardBodySchema = z.object({
  obverse: z.string(),
  reverse: z.string(),
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

export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
