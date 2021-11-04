/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SortOrder } from "domains";
import { CardSort } from "domains/card";
import { DeckSort } from "domains/deck";
import prisma from "lib/prisma";

export async function findUserDecksWithCards(userId: number, sort: DeckSort) {
  const mappedSortField = (() => {
    const order: SortOrder = sort.order;

    switch (sort.sortBy) {
      case "name":
        return { name: order };
      case "cardsCount":
        return { cards: { _count: order } };
      case "isFavorite":
        return { isFavorite: order };
      case "createdAt":
        return { createdAt: order };
      case "updatedAt":
        return { createdAt: order };
    }
  })();

  const userDecks = await prisma.deck.findMany({
    where: {
      userId,
    },
    orderBy: mappedSortField,
    select: {
      id: true,
      name: true,
      tags: true,
      isFavorite: true,
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

export async function findUserDeck(
  userId: number,
  deckId: number,
  cardSort: CardSort
) {
  const mappedCardSortField = (() => {
    const order: SortOrder = cardSort.order;

    switch (cardSort.sortBy) {
      case "type":
        return { type: order };
      case "createdAt":
        return { createdAt: order };
      case "updatedAt":
        return { createdAt: order };
    }
  })();

  const userDeck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      userId,
    },
    select: {
      id: true,
      name: true,
      isFavorite: true,
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
        orderBy: mappedCardSortField,
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
