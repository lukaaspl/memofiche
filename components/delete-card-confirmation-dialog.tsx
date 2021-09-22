import { DECKS_QUERY_KEY, SPECIFIED_DECK_QUERY_KEY } from "consts/query-keys";
import { Card } from "@prisma/client";
import { DetailedCard } from "domains/card";
import { authApiClient } from "lib/axios";
import React from "react";
import { useQueryClient, useMutation } from "react-query";
import CustomAlertDialog from "./ui/custom-alert-dialog";

interface DeleteCardVariables {
  deckId: number;
  cardId: number;
}

async function deleteCard(variables: DeleteCardVariables): Promise<Card> {
  const { deckId, cardId } = variables;

  const { data: deletedCard } = await authApiClient.delete<Card>(
    `/decks/${deckId}/card/${cardId}`
  );

  return deletedCard;
}

interface DeleteCardConfirmationDialogProps {
  card: DetailedCard;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteCardConfirmationDialog({
  card,
  isOpen,
  onClose,
}: DeleteCardConfirmationDialogProps): JSX.Element {
  const queryClient = useQueryClient();

  const deleteCardMutation = useMutation(deleteCard, {
    onSuccess: (card) => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries(SPECIFIED_DECK_QUERY_KEY(card.deckId));
      onClose();
    },
  });

  return (
    <CustomAlertDialog
      title="Delete card?"
      content={`Are you sure? You can't undo this action afterwards.`}
      isLoading={deleteCardMutation.isLoading}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() =>
        deleteCardMutation.mutate({
          cardId: card.id,
          deckId: card.deckId,
        })
      }
    />
  );
}
