import { Prisma } from "lib/prisma";
import { findUserDeck, findUserDecksWithCards } from "repositories/deck";
import { postDeckBodySchema, resetCardsQuerySchema } from "utils/validation";
import { z } from "zod";

export type PostDeckRequestData = z.input<typeof postDeckBodySchema>;

export type UpdateDeckRequestData = { id: number } & PostDeckRequestData;

export type DetailedDeck = NonNullable<
  Prisma.PromiseReturnType<typeof findUserDeck>
>;

export type DecksWithCards = Prisma.PromiseReturnType<
  typeof findUserDecksWithCards
>;

export type DeckWithCards = DecksWithCards[0];

export type BasicDeckDetails = Pick<DeckWithCards, "id" | "name"> & {
  cardsCount: number;
};

export type ResetCardsMode = z.infer<typeof resetCardsQuerySchema>["mode"];
