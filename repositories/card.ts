/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Card, CardMemoParams } from "@prisma/client";
import { Nullable } from "domains";
import { UpdatedCardRequestBody } from "domains/card";
import prisma from "lib/prisma";
import { getInitialSMParams } from "utils/super-memo";
import { TagsConverter } from "utils/tags";

export async function updateDeckCard(
  oldCard: Card & { memoParams: Nullable<CardMemoParams> },
  updatedCard: UpdatedCardRequestBody
): Promise<Card> {
  const shouldResetMemoParams =
    updatedCard.obverse !== oldCard.obverse ||
    updatedCard.reverse !== oldCard.reverse;

  const MDdefaults = getInitialSMParams();

  const normalizedTags = TagsConverter.normalize(updatedCard.tags);

  return await prisma.card.update({
    where: {
      id: oldCard.id,
    },
    data: {
      obverse: updatedCard.obverse,
      reverse: updatedCard.reverse,
      type: updatedCard.type,
      tags: {
        set: [],
        create: normalizedTags.map((tag) => ({
          tag: {
            connectOrCreate: {
              create: { name: tag },
              where: { name: tag },
            },
          },
        })),
      },
      memoParams: {
        update: {
          easiness: {
            set: shouldResetMemoParams
              ? MDdefaults.easiness
              : oldCard.memoParams?.easiness,
          },
          interval: {
            set: shouldResetMemoParams
              ? MDdefaults.interval
              : oldCard.memoParams?.interval,
          },
          repetitions: {
            set: shouldResetMemoParams
              ? MDdefaults.repetitions
              : oldCard.memoParams?.repetitions,
          },
        },
      },
    },
  });
}
