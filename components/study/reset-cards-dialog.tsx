import { Box, Divider, Heading, Text, useToast } from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import CustomDialog from "components/ui/custom-dialog";
import { DECKS_QUERY_KEY, SPECIFIED_DECK_QUERY_KEY } from "consts/query-keys";
import { Nullable } from "domains";
import { BasicDeckDetails, ResetCardsMode } from "domains/deck";
import { authApiClient } from "lib/axios";
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

  const { status } = await authApiClient.put<void>(
    `/decks/${deckId}/reset-cards?mode=${mode}`
  );

  return status;
}

export default function ResetCardsDialog({
  isOpen,
  deckDetails,
  onClose,
}: ResetCardsDialog): JSX.Element {
  const queryClient = useQueryClient();
  const toast = useToast();

  const resetCardsMutation = useMutation(resetCards, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries(SPECIFIED_DECK_QUERY_KEY(variables.deckId));

      toast({
        status: "success",
        description: "Cards have been reset successfully",
      });

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
              <Text as="span" color="purple.500" fontWeight="bold">
                {deckDetails?.cardsCount}{" "}
                {deckDetails?.cardsCount === 1 ? "card" : "cards"}
              </Text>{" "}
              from the{" "}
              <Text as="span" color="purple.500" fontWeight="bold">
                {deckDetails?.name}
              </Text>{" "}
              deck. Pick a method how you want to do it:
            </Text>
            <Box>
              <Heading
                fontSize="sm"
                fontFamily="Poppins"
                color="purple.500"
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
                color="red.500"
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
