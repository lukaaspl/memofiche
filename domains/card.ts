import { findUserDeck } from "repositories/deck";
import { postCardBodySchema, sortCardsQuerySchema } from "utils/validation";
import { z } from "zod";
import { Prisma } from "lib/prisma";
import { EnhancedDeckWithCards } from "./deck";

export type PostCardRequestData = { deckId: number } & z.input<
  typeof postCardBodySchema
>;

export type UpdateCardRequestData = { id: number } & PostCardRequestData;

export type UpdatedCardRequestBody = z.output<typeof postCardBodySchema>;

export type DetailedCard = NonNullable<
  Prisma.PromiseReturnType<typeof findUserDeck>
>["cards"][0];

export type CardWithMemoParams = EnhancedDeckWithCards["cards"][0];

export type CardSort = z.infer<typeof sortCardsQuerySchema>;
