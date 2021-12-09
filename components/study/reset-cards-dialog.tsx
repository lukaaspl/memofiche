import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import CustomDialog from "components/ui/custom-dialog";
import Span from "components/ui/span";
import { DECKS_QUERY_KEY, DECK_QUERY_KEY } from "consts/query-keys";
import { Nullable } from "domains";
import { BasicDeckDetails, ResetCardsMode } from "domains/deck";
import useCommonPalette from "hooks/use-common-palette";
import useSuccessToast from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import { stringifyUrl } from "query-string";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

interface ResetCardsDialog {
  isOpen: boolean;
  deckDetails: Nullable<BasicDeckDetails>;
  onClose: () => void;
}

interface ResetCardsVariables {
  deckId: number;
  mode: ResetCardsMode;
}

async function resetCards(variables: ResetCardsVariables): Promise<number> {
  const { deckId, mode } = variables;

  const url = stringifyUrl({
    url: `/decks/${deckId}/reset-cards`,
    query: { mode },
  });

  const { status } = await authApiClient.put<void>(url);

  return status;
}

export default function ResetCardsDialog({
  isOpen,
  deckDetails,
  onClose,
}: ResetCardsDialog): JSX.Element {
  const queryClient = useQueryClient();
  const toast = useSuccessToast();
  const palette = useCommonPalette();

  const resetCardsMutation = useMutation(resetCards, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries([DECK_QUERY_KEY, variables.deckId]);
      toast("Cards have been reset successfully");
      onClose();
    },
  });

  const getResetCardsHandler = (mode: ResetCardsMode) => () => {
    if (deckDetails) {
      resetCardsMutation.mutate({ deckId: deckDetails.id, mode });
    }
  };

  return (
    <CustomDialog
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      title="Reset deck's cards"
      render={({ Body, Footer }) => (
        <>
          <Body>
            <Text mb={6} fontSize="sm">
              You are going to reset all{" "}
              <Span color={palette.primary} fontWeight="bold">
                {deckDetails?.cardsCount}{" "}
                {deckDetails?.cardsCount === 1 ? "card" : "cards"}
              </Span>{" "}
              from the{" "}
              <Span color={palette.primary} fontWeight="bold">
                {deckDetails?.name}
              </Span>{" "}
              deck. Pick a method how you want to do it:
            </Text>
            <Box>
              <Heading
                fontSize="sm"
                fontFamily="Poppins"
                color={palette.primary}
                letterSpacing="wide"
                textTransform="uppercase"
                mb={2}
              >
                Shallow reset
              </Heading>
              <Text fontSize="sm">
                The shallow reset means all cards&apos; due dates will be set to
                now, hence you can start studying them without waiting until the
                required time has elapsed. At the same time, this reset has no
                effect on other card parameters that affect their scheduling
                process.
              </Text>
              <CustomButton
                size="sm"
                fontSize="sm"
                textTransform="uppercase"
                colorScheme="purple"
                mt={3}
                isLoading={
                  resetCardsMutation.isLoading &&
                  resetCardsMutation.variables?.mode === "shallow"
                }
                loadingText="Resetting..."
                disabled={resetCardsMutation.isLoading}
                onClick={getResetCardsHandler("shallow")}
              >
                Shallow reset
              </CustomButton>
            </Box>
            <Divider my={5} />
            <Box>
              <Heading
                fontSize="sm"
                fontFamily="Poppins"
                color={palette.red}
                letterSpacing="wide"
                textTransform="uppercase"
                mb={2}
              >
                Deep reset
              </Heading>
              <Text fontSize="sm">
                The deep reset means all cards&apos; parameters will be set to
                their defaults as if the cards have just been created. The
                scheduling system will forget about their previous statistics.
              </Text>
              <CustomButton
                size="sm"
                fontSize="sm"
                textTransform="uppercase"
                colorScheme="red"
                mt={3}
                isLoading={
                  resetCardsMutation.isLoading &&
                  resetCardsMutation.variables?.mode === "deep"
                }
                loadingText="Resetting..."
                disabled={resetCardsMutation.isLoading}
                onClick={getResetCardsHandler("deep")}
              >
                Deep reset
              </CustomButton>
            </Box>
          </Body>
          <Footer>
            <CustomButton onClick={onClose}>Cancel</CustomButton>
          </Footer>
        </>
      )}
    />
  );
}
