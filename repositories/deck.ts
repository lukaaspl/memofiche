/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import prisma from "lib/prisma";

export async function findUserDecksWithCards(userId: number) {
  const userDecks = await prisma.deck.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      cards: {
        select: {
          memoParams: {
            select: {
              dueDate: true,
            },
          },
        },
      },
    },
  });

  return userDecks;
}

export async function findUserDeck(userId: number, deckId: number) {
  const userDeck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      userId,
    },
    select: {
      id: true,
      name: true,
      cards: {
        include: {
          memoParams: true,
          tags: {
            select: {
              tag: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return userDeck;
}

export async function findUserDeckWithSpecifiedCard(
  userId: number,
  deckId: number,
  cardId: number
) {
  return await prisma.deck.findFirst({
    where: {
      id: deckId,
      userId,
    },
    select: {
      cards: {
        where: {
          id: cardId,
        },
        include: { memoParams: true },
      },
    },
  });
}