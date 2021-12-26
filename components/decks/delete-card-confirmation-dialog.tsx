import { Card } from "@prisma/client";
import CustomAlertDialog from "components/shared/custom-alert-dialog";
import { DECKS_QUERY_KEY, DECK_QUERY_KEY } from "consts/query-keys";
import { DetailedCard } from "domains/card";
import useSuccessToast from "hooks/use-success-toast";
import useTranslation from "hooks/use-translation";
import { authApiClient } from "lib/axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

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
  const { $t } = useTranslation();
  const toast = useSuccessToast();

  const deleteCardMutation = useMutation(deleteCard, {
    onSuccess: (card) => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries([DECK_QUERY_KEY, card.deckId]);
      toast($t({ defaultMessage: "Card has been deleted successfully" }));
      onClose();
    },
  });

  return (
    <CustomAlertDialog
      title={$t({ defaultMessage: "Delete card?" })}
      content={$t({
        defaultMessage: "Are you sure? You can't undo this action afterwards.",
      })}
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
