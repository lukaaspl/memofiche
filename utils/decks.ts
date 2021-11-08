import { StudySession } from ".prisma/client";
import { DeckSort, DeckWithCards, EnhancedDeckWithCards } from "domains/deck";
import { orderBy } from "lodash";
import { getReadyToStudyCards, revealCardNearestStudyTime } from "utils/cards";
import { getSessionLastStudiedDate } from "utils/study";

export function enhanceDecksWithStudyParams(
  decks: DeckWithCards[],
  userSessions: StudySession[]
): EnhancedDeckWithCards[] {
  const sessionsByDeckId = userSessions.reduce((map, session) => {
    const currentDeckSessions = map.get(session.deckId);

    if (currentDeckSessions) {
      currentDeckSessions.push(session);
    } else {
      map.set(session.deckId, [session]);
    }

    return map;
  }, new Map<number, StudySession[]>());

  return decks.map((deck) => {
    const deckSessions = sessionsByDeckId.get(deck.id);

    return {
      ...deck,
      cardsCount: deck.cards.length,
      studyingCardsCount: getReadyToStudyCards(deck.cards).length,
      nearestStudyTime: revealCardNearestStudyTime(deck.cards),
      lastStudied: getSessionLastStudiedDate(deckSessions),
    };
  });
}

export function sortDecksAdvanced(
  decks: EnhancedDeckWithCards[],
  sort: DeckSort
): EnhancedDeckWithCards[] {
  if (sort.sortBy === "studyingCardsCount") {
    return orderBy(decks, (deck) => deck.studyingCardsCount, [sort.order]);
  }

  if (sort.sortBy === "studyingCardsPercentage") {
    return orderBy(
      decks,
      [
        (deck) => deck.studyingCardsCount / deck.cardsCount || 0,
        (deck) => deck.cardsCount,
      ],
      [sort.order, sort.order]
    );
  }

  return decks;
}
