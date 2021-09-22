/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Card, CardMemoDetails } from "@prisma/client";
import { Nullable } from "domains";
import { UpdatedCardRequestBody } from "domains/card";
import prisma from "lib/prisma";
import { getDefaultMemoDetails } from "utils/super-memo";

export async function updateDeckCard(
  cardId: number,
  oldCard: Card & { memoDetails: Nullable<CardMemoDetails> },
  updatedCard: UpdatedCardRequestBody
): Promise<Card> {
  const shouldResetMemoDetails =
    updatedCard.obverse !== oldCard.obverse ||
    updatedCard.reverse !== oldCard.reverse;

  const MDdefaults = getDefaultMemoDetails();

  return await prisma.card.update({
    where: {
      id: cardId,
    },
    data: {
      obverse: updatedCard.obverse,
      reverse: updatedCard.reverse,
      type: updatedCard.type,
      tags: {
        set: [],
        create: updatedCard.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              create: { name: tag },
              where: { name: tag },
            },
          },
        })),
      },
      memoDetails: {
        update: {
          easiness: {
            set: shouldResetMemoDetails
              ? MDdefaults.easiness
              : oldCard.memoDetails?.easiness,
          },
          interval: {
            set: shouldResetMemoDetails
              ? MDdefaults.interval
              : oldCard.memoDetails?.interval,
          },
          repetitions: {
            set: shouldResetMemoDetails
              ? MDdefaults.repetitions
              : oldCard.memoDetails?.repetitions,
          },
        },
      },
    },
  });
}
