import { DECKS_QUERY_KEY } from "consts/query-keys";
import { DeckSort, EnhancedDeckWithCards } from "domains/deck";
import { authApiClient } from "lib/axios";
import { omit } from "lodash";
import { stringifyUrl } from "query-string";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

interface DecksQuery extends DeckSort {
  limit?: number;
}

async function fetchDecks(query: DecksQuery): Promise<EnhancedDeckWithCards[]> {
  const url = stringifyUrl({
    url: "/decks",
    query: { ...query },
  });

  const { data: decks } = await authApiClient.get<EnhancedDeckWithCards[]>(url);

  return decks;
}

export default function useDecksQuery(
  query: DecksQuery,
  options?: UseQueryOptions<EnhancedDeckWithCards[]>
): UseQueryResult<EnhancedDeckWithCards[]> {
  return useQuery(
    [DECKS_QUERY_KEY, omit(query, "limit")],
    () => fetchDecks(query),
    options
  );
}
