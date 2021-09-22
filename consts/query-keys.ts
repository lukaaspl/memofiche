export const DECKS_QUERY_KEY = "DECKS";

export function SPECIFIED_DECK_QUERY_KEY(deckId: number): ["DECK", number] {
  return ["DECK", deckId];
}
