import { DECKS_QUERY_KEY } from "consts/query-keys";
import { DecksWithCards } from "domains/deck";
import { authApiClient } from "lib/axios";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";

async function fetchDecks(): Promise<DecksWithCards> {
  const { data: decks } = await authApiClient.get<DecksWithCards>("/decks");
  return decks;
}

export default function useDecksQuery(
  options?: UseQueryOptions<DecksWithCards>
): UseQueryResult<DecksWithCards> {
  return useQuery(DECKS_QUERY_KEY, fetchDecks, options);
}
