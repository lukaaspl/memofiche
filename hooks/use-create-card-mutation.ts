import { Card } from "@prisma/client";
import { DECKS_QUERY_KEY, SPECIFIED_DECK_QUERY_KEY } from "consts/query-keys";
import { PostCardRequestData } from "domains/card";
import { authApiClient } from "lib/axios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import useSuccessToast from "./use-success-toast";

async function createCard(variables: PostCardRequestData): Promise<Card> {
  const { deckId, ...body } = variables;

  const { data: createdCard } = await authApiClient.post<Card>(
    `/decks/${deckId}/card`,
    body
  );

  return createdCard;
}

export default function useCreateCardMutation(
  options?: UseMutationOptions<Card, unknown, PostCardRequestData, unknown>
): UseMutationResult<Card, unknown, PostCardRequestData, unknown> {
  const queryClient = useQueryClient();
  const toast = useSuccessToast();

  return useMutation(createCard, {
    ...options,
    onSuccess: (card, ...args) => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries(SPECIFIED_DECK_QUERY_KEY(card.deckId));
      toast("Card has been created successfully");
      options?.onSuccess?.(card, ...args);
    },
  });
}
