import { Prisma } from "lib/prisma";
import { findUserDeck, findUserDecksWithCards } from "repositories/deck";
import { postDeckBodySchema } from "utils/validation";
import { z } from "zod";

export type PostDeckRequestData = z.input<typeof postDeckBodySchema>;

export type UpdateDeckRequestData = { id: number } & PostDeckRequestData;

export type DetailedDeck = NonNullable<
  Prisma.PromiseReturnType<typeof findUserDeck>
>;

export type DecksWithCards = Prisma.PromiseReturnType<
  typeof findUserDecksWithCards
>;

export type CardWithMemoParams = DecksWithCards[0]["cards"][0];
