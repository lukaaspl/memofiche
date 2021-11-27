import { Card } from "@prisma/client";
import { Prisma } from "lib/prisma";
import { findUserDeck } from "repositories/deck";
import { postCardBodySchema, sortCardsQuerySchema } from "utils/validation";
import { z } from "zod";
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

export interface CardMeta {
  isSwapped: boolean;
}

export type TransformedCard<TCard extends Card> = TCard & {
  meta: CardMeta;
};
