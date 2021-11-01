import { findUserDeck } from "repositories/deck";
import { postCardBodySchema } from "utils/validation";
import { z } from "zod";
import { Prisma } from "lib/prisma";
import { DeckWithCards } from "./deck";

export type PostCardRequestData = { deckId: number } & z.input<
  typeof postCardBodySchema
>;

export type UpdateCardRequestData = { id: number } & PostCardRequestData;

export type UpdatedCardRequestBody = z.output<typeof postCardBodySchema>;

export type DetailedCard = NonNullable<
  Prisma.PromiseReturnType<typeof findUserDeck>
>["cards"][0];

export type CardWithMemoParams = DeckWithCards["cards"][0];