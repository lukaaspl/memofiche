import { DeckWithCards, EnhancedDeckWithCards } from "domains/deck";
import { getReadyToStudyCards, revealCardNearestStudyTime } from "utils/cards";

export function enhanceDecksWithStudyParams(
  decks: DeckWithCards[]
): EnhancedDeckWithCards[] {
  return decks.map((deck) => ({
    ...deck,
    cardsCount: deck.cards.length,
    studyingCardsCount: getReadyToStudyCards(deck.cards).length,
    nearestStudyTime: revealCardNearestStudyTime(deck.cards),
  }));
}
