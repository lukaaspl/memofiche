/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import prisma from "lib/prisma";

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
