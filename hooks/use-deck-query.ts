import { SPECIFIED_DECK_QUERY_KEY } from "consts/query-keys";
import { DetailedDeck } from "domains/deck";
import { authApiClient } from "lib/axios";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

async function fetchDeckById(deckId: number): Promise<DetailedDeck> {
  const { data: deck } = await authApiClient.get<DetailedDeck>(
    `/decks/${deckId}`
  );

  return deck;
}

export default function useDeckQuery(
  deckId: number,
  options?: UseQueryOptions<DetailedDeck>
): UseQueryResult<DetailedDeck> {
  return useQuery(
    SPECIFIED_DECK_QUERY_KEY(deckId),
    () => fetchDeckById(deckId),
    options
  );
}
