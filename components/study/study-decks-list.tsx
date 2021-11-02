import {
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import CustomList from "components/ui/custom-list";
import Feedback from "components/ui/feedback";
import { TooltipIconButton } from "components/ui/tooltip-buttons";
import { Nullable } from "domains";
import { BasicDeckDetails, DeckWithCards } from "domains/deck";
import useDecksQuery from "hooks/use-decks-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { MdEdit, MdRestore } from "react-icons/md";
import { getReadyToStudyCards, revealCardNearestStudyTime } from "utils/cards";
import { timeToX } from "utils/date-time";
import ResetCardsDialog from "./reset-cards-dialog";

export default function StudyDecksList(): JSX.Element {
  const { data: decks, isLoading, error } = useDecksQuery();
  const [bufferedDeckDetails, setBufferedDeckDetails] =
    useState<Nullable<BasicDeckDetails>>(null);

  const [
    isResetCardsDialogOpen,
    onResetCardsDialogOpen,
    onResetCardsDialogClose,
  ] = useSimpleDisclosure();

  const handleOpenResetCardDialog = (deck: DeckWithCards): void => {
    setBufferedDeckDetails({
      id: deck.id,
      name: deck.name,
      cardsCount: deck.cards.length,
    });

    onResetCardsDialogOpen();
  };

  const enhancedSortedDecks = useMemo(() => {
    if (!decks) {
      return;
    }

    return decks
      .map((deck) => ({
        ...deck,
        cardsCount: deck.cards.length,
        readyToLearnCardsCount: getReadyToStudyCards(deck.cards).length,
        nearestStudyTime: revealCardNearestStudyTime(deck.cards),
      }))
      .sort(
        (deckX, deckY) =>
          deckY.readyToLearnCardsCount - deckX.readyToLearnCardsCount
      );
  }, [decks]);

  if (error) {
    return <Feedback type="error" />;
  }

  if (!enhancedSortedDecks || isLoading) {
    return <Feedback type="loading" />;
  }

  return (
    <>
      <Heading size="md" mt={5} mb={2}>
        Choose a deck to study
      </Heading>
      <Divider />
      {enhancedSortedDecks.length === 0 && (
        <Feedback
          type="empty-state"
          message="The deck with cards is required to start studying"
          actionButtonLabel="Create deck"
          actionButtonHref="/decks?add-deck=true"
        />
      )}
      <CustomList
        mt={5}
        items={enhancedSortedDecks}
        selectId={(deck) => deck.id}
        disableItem={(deck) => deck.readyToLearnCardsCount === 0}
        renderItem={(deck) => {
          const isDisabled = deck.readyToLearnCardsCount === 0;

          return (
            <Flex width="100%" justify="space-between" align="center">
              <Stat opacity={isDisabled ? 0.8 : 1}>
                <HStack>
                  <StatLabel
                    fontSize="larger"
                    fontWeight="bold"
                    color={isDisabled ? "gray.900" : "purple.900"}
                  >
                    {deck.name}
                  </StatLabel>
                  <HStack spacing={1}>
                    <Link href={`/decks/${deck.id}`} passHref>
                      <TooltipIconButton
                        tooltipProps={{
                          hasArrow: true,
                          label: "Edit deck",
                          placement: "top",
                          openDelay: 300,
                        }}
                        onFocus={(e) => e.preventDefault()}
                        colorScheme="purple"
                        aria-label="Edit"
                        icon={<MdEdit fontSize="16px" />}
                        variant="outline"
                        size="xs"
                      />
                    </Link>
                    {deck.cards.length > 0 && (
                      <TooltipIconButton
                        tooltipProps={{
                          hasArrow: true,
                          label: "Reset deck's cards",
                          placement: "top",
                          openDelay: 300,
                        }}
                        onFocus={(e) => e.preventDefault()}
                        colorScheme="purple"
                        aria-label="Reset"
                        icon={<MdRestore fontSize="16px" />}
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenResetCardDialog(deck)}
                      />
                    )}
                  </HStack>
                </HStack>
                <StatNumber fontSize="xl" fontWeight="bold" letterSpacing="4px">
                  <Text as="span" color={isDisabled ? "gray.600" : "green.600"}>
                    {deck.readyToLearnCardsCount}
                  </Text>
                  /{deck.cardsCount}
                </StatNumber>
                <StatHelpText fontSize="small">
                  Cards ready to learn / total
                </StatHelpText>
              </Stat>
              <Stack direction="column" align="flex-end" spacing={2}>
                {isDisabled ? (
                  <>
                    {deck.cardsCount === 0 ? (
                      <>
                        <Link href={`/decks/${deck.id}?add-card=true`} passHref>
                          <CustomButton colorScheme="purple" variant="outline">
                            Build your deck
                          </CustomButton>
                        </Link>
                        <Text fontSize="small">
                          Add some cards to start studying
                        </Text>
                      </>
                    ) : (
                      <Text fontSize="small">
                        The nearest card to study{" "}
                        {timeToX(deck.nearestStudyTime as number)}
                      </Text>
                    )}
                  </>
                ) : (
                  <Link href={`/study/${deck.id}`} passHref>
                    <CustomButton variant="solid" colorScheme="purple">
                      Start studying
                    </CustomButton>
                  </Link>
                )}
              </Stack>
            </Flex>
          );
        }}
      />
      <ResetCardsDialog
        isOpen={isResetCardsDialogOpen}
        deckDetails={bufferedDeckDetails}
        onClose={onResetCardsDialogClose}
      />
    </>
  );
}
