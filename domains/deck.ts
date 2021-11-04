import { Nullable } from "domains";
import { Prisma } from "lib/prisma";
import { findUserDeck, findUserDecksWithCards } from "repositories/deck";
import {
  postDeckBodySchema,
  resetCardsQuerySchema,
  sortDecksQuerySchema,
} from "utils/validation";
import { z } from "zod";

export type PostDeckRequestData = z.input<typeof postDeckBodySchema>;

export type UpdateDeckRequestData = { id: number } & PostDeckRequestData;

export type DetailedDeck = NonNullable<
  Prisma.PromiseReturnType<typeof findUserDeck>
>;

export type DeckWithCards = Prisma.PromiseReturnType<
  typeof findUserDecksWithCards
>[0];

export interface EnhancedDeckWithCards extends DeckWithCards {
  cardsCount: number;
  studyingCardsCount: number;
  nearestStudyTime: Nullable<number>;
}

export type BasicDeckDetails = Pick<
  EnhancedDeckWithCards,
  "id" | "name" | "cardsCount"
>;
export type ResetCardsMode = z.infer<typeof resetCardsQuerySchema>["mode"];

export type DeckSort = z.infer<typeof sortDecksQuerySchema>;
