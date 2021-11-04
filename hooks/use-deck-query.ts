import { SPECIFIED_DECK_QUERY_KEY } from "consts/query-keys";
import { CardSort } from "domains/card";
import { DetailedDeck } from "domains/deck";
import { authApiClient } from "lib/axios";
import { stringifyUrl } from "query-string";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

async function fetchDeckById(
  deckId: number,
  sort?: CardSort
): Promise<DetailedDeck> {
  const url = stringifyUrl({
    url: `/decks/${deckId}`,
    query: sort,
  });

  const { data: deck } = await authApiClient.get<DetailedDeck>(url);

  return deck;
}

export default function useDeckQuery(
  deckId: number,
  sort?: CardSort,
  options?: UseQueryOptions<DetailedDeck>
): UseQueryResult<DetailedDeck> {
  return useQuery(
    [SPECIFIED_DECK_QUERY_KEY(deckId), sort],
    () => fetchDeckById(deckId, sort),
    options
  );
}
