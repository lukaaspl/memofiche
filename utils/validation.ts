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
