import { Text } from "@chakra-ui/react";
import { Deck } from "@prisma/client";
import CustomAlertDialog from "components/ui/custom-alert-dialog";
import Span from "components/ui/span";
import { DECKS_QUERY_KEY } from "consts/query-keys";
import { DetailedDeck } from "domains/deck";
import useCommonPalette from "hooks/use-common-palette";
import useScreenWidth from "hooks/use-screen-width";
import useSuccessToast from "hooks/use-success-toast";
import useTranslation from "hooks/use-translation";
import { authApiClient } from "lib/axios";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

async function deleteDeckById(deckId: number): Promise<Deck> {
  const { data: deletedDeck } = await authApiClient.delete<Deck>(
    `/decks/${deckId}`
  );

  return deletedDeck;
}

interface DeleteDeckConfirmationDialogProps {
  deck: DetailedDeck;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteDeckConfirmationDialog({
  deck,
  isOpen,
  onClose,
}: DeleteDeckConfirmationDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const { isLargerThanSM } = useScreenWidth();
  const toast = useSuccessToast();
  const router = useRouter();
  const { $t } = useTranslation();
  const palette = useCommonPalette();

  const deleteDeckMutation = useMutation(deleteDeckById, {
    onSuccess: () => {
      toast($t({ defaultMessage: "Deck has been deleted successfully" }));
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      router.push("/decks");
    },
  });

  return (
    <CustomAlertDialog
      size={isLargerThanSM ? "md" : "full"}
      title={$t({ defaultMessage: "Delete deck?" })}
      content={
        <>
          {$t({
            defaultMessage:
              "Are you sure? You can't undo this action afterwards.",
          })}
          {deck.cards.length > 0 && (
            <Text fontWeight="medium">
              {$t(
                {
                  defaultMessage:
                    "Important! You are going to lose all {count} cards contained in the deck!",
                },
                { count: <Span color={palette.red}>{deck.cards.length}</Span> }
              )}
            </Text>
          )}
        </>
      }
      isOpen={isOpen}
      isLoading={deleteDeckMutation.isLoading}
      onClose={onClose}
      onConfirm={() => deleteDeckMutation.mutate(deck.id)}
    />
  );
}
