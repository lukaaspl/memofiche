import { Card } from "@prisma/client";
import { DECKS_QUERY_KEY, DECK_QUERY_KEY } from "consts/query-keys";
import { PostCardRequestData } from "domains/card";
import { authApiClient } from "lib/axios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import useSuccessToast from "./use-success-toast";
import useTranslation from "./use-translation";

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
  const { $t } = useTranslation();
  const toast = useSuccessToast();

  return useMutation(createCard, {
    ...options,
    onSuccess: (card, ...args) => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries([DECK_QUERY_KEY, card.deckId]);
      toast($t({ defaultMessage: "Card has been created successfully" }));
      options?.onSuccess?.(card, ...args);
    },
  });
}
