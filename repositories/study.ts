/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { StudySession } from "@prisma/client";
import dayjs from "dayjs";
import prisma from "lib/prisma";
import { assert } from "utils/validation";

export function getStudySessionsAvgsRelativeToUserDeck(deckId: number) {
  return prisma.studySession.aggregate({
    where: { deckId },
    _avg: {
      studyTime: true,
      avgTimePerCard: true,
      avgRate: true,
      studiedCards: true,
      positiveCards: true,
      negativeCards: true,
    },
  });
}

export function getStudySessionsAvgsRelativeToAllUserDecks(userId: number) {
  return prisma.studySession.aggregate({
    where: { deck: { userId } },
    _avg: {
      studyTime: true,
      avgTimePerCard: true,
      avgRate: true,
      studiedCards: true,
      positiveCards: true,
      negativeCards: true,
    },
  });
}

export async function findStudySessionsByUserId(
  userId: number,
  periodInDays?: number
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      decks: {
        select: {
          studySessions: {
            where: periodInDays
              ? {
                  createdAt: {
                    gte: dayjs().subtract(periodInDays, "day").toDate(),
                  },
                }
              : undefined,
            include: {
              deck: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  assert(user);

  const sessions = user.decks.flatMap((deck) => deck.studySessions);

  return sessions;
}
