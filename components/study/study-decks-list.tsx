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
import SortingControls from "components/ui/sorting-controls";
import Span from "components/ui/span";
import SyncSpinner from "components/ui/sync-spinner";
import { TooltipIconButton } from "components/ui/tooltip-buttons";
import { STUDY_DECKS_SORT } from "consts/storage-keys";
import { Nullable } from "domains";
import {
  BasicDeckDetails,
  DeckSort,
  EnhancedDeckWithCards,
} from "domains/deck";
import useCommonPalette from "hooks/use-common-palette";
import useDecksQuery from "hooks/use-decks-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useSortState from "hooks/use-sort-state";
import Link from "next/link";
import React, { useState } from "react";
import { MdEdit, MdRestore } from "react-icons/md";
import { timeToX } from "utils/date-time";
import ResetCardsDialog from "./reset-cards-dialog";

export default function StudyDecksList(): JSX.Element {
  const palette = useCommonPalette();

  const { sortState, updateField, updateOrder } = useSortState<
    DeckSort["sortBy"]
  >(STUDY_DECKS_SORT, { sortBy: "studyingCardsPercentage", order: "desc" });

  const {
    data: decks,
    isRefetching,
    error,
  } = useDecksQuery(sortState, { keepPreviousData: true });

  const [bufferedDeckDetails, setBufferedDeckDetails] =
    useState<Nullable<BasicDeckDetails>>(null);

  const [
    isResetCardsDialogOpen,
    onResetCardsDialogOpen,
    onResetCardsDialogClose,
  ] = useSimpleDisclosure();

  const handleOpenResetCardDialog = (deck: EnhancedDeckWithCards): void => {
    setBufferedDeckDetails({
      id: deck.id,
      name: deck.name,
      cardsCount: deck.cardsCount,
    });

    onResetCardsDialogOpen();
  };

  if (error) {
    return <Feedback type="error" />;
  }

  if (!decks) {
    return <Feedback type="loading" />;
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading display="flex" size="md" mt={5} mb={3}>
          <span>Choose a deck to study</span>
          {isRefetching && <SyncSpinner />}
        </Heading>
        <SortingControls<DeckSort["sortBy"]>
          options={[
            { label: "Name", value: "name" },
            { label: "Cards count", value: "cardsCount" },
            { label: "Study cards count", value: "studyingCardsCount" },
            { label: "Study cards ratio", value: "studyingCardsPercentage" },
            { label: "Favorite", value: "isFavorite" },
            { label: "Creation date", value: "createdAt" },
            { label: "Last modify", value: "updatedAt" },
          ]}
          state={sortState}
          onChangeField={updateField}
          onChangeOrder={updateOrder}
        />
      </Flex>
      <Divider />
      {decks.length === 0 && (
        <Feedback
          type="empty-state"
          message="The deck with cards is required to start studying"
          actionButtonLabel="Create deck"
          actionButtonHref="/decks?add-deck=true"
        />
      )}
      <CustomList
        mt={6}
        items={decks}
        selectId={(deck) => deck.id}
        disableItem={(deck) => deck.studyingCardsCount === 0}
        isFavorite={(deck) => deck.isFavorite}
        renderItem={(deck) => {
          const isDisabled = deck.studyingCardsCount === 0;

          return (
            <Flex width="100%" justify="space-between" align="center">
              <Stat opacity={isDisabled ? 0.8 : 1}>
                <HStack>
                  <StatLabel fontSize="larger" fontWeight="bold">
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
                <StatNumber fontSize="xl" fontWeight="bold" letterSpacing="2px">
                  <Span color={!isDisabled ? palette.green : undefined}>
                    {deck.studyingCardsCount}
                  </Span>
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
