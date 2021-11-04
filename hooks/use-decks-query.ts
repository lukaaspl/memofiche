import { DECKS_QUERY_KEY } from "consts/query-keys";
import { DeckSort, EnhancedDeckWithCards } from "domains/deck";
import { authApiClient } from "lib/axios";
import { stringifyUrl } from "query-string";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

async function fetchDecks(sort?: DeckSort): Promise<EnhancedDeckWithCards[]> {
  const url = stringifyUrl({
    url: "/decks",
    query: sort,
  });

  const { data: decks } = await authApiClient.get<EnhancedDeckWithCards[]>(url);

  return decks;
}

export default function useDecksQuery(
  sort?: DeckSort,
  options?: UseQueryOptions<EnhancedDeckWithCards[]>
): UseQueryResult<EnhancedDeckWithCards[]> {
  return useQuery([DECKS_QUERY_KEY, sort], () => fetchDecks(sort), options);
}
