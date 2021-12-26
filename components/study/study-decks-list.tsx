import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import CustomButton from "components/shared/custom-button";
import CustomList from "components/shared/custom-list";
import Feedback from "components/shared/feedback";
import SortingControls from "components/shared/sorting-controls";
import Span from "components/shared/span";
import SyncSpinner from "components/shared/sync-spinner";
import { TooltipIconButton } from "components/shared/tooltip-buttons";
import { STUDY_DECKS_SORT } from "consts/storage-keys";
import { Nullable } from "domains";
import {
  BasicDeckDetails,
  DeckSort,
  EnhancedDeckWithCards,
} from "domains/deck";
import useCommonPalette from "hooks/use-common-palette";
import useDecksQuery from "hooks/use-decks-query";
import useScreenWidth from "hooks/use-screen-width";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useSortState from "hooks/use-sort-state";
import useTranslation from "hooks/use-translation";
import Link from "next/link";
import React, { useState } from "react";
import { MdEdit, MdRestore } from "react-icons/md";
import { timeToX } from "utils/date-time";
import ResetCardsDialog from "./reset-cards-dialog";

export default function StudyDecksList(): JSX.Element {
  const { $t } = useTranslation();
  const { isLargerThanMD } = useScreenWidth();
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
      <Flex
        justify={{ base: "flex-start", md: "space-between" }}
        align={{ base: "flex-start", md: "flex-end" }}
        direction={{ base: "column", md: "row" }}
        mt={{ base: 5, md: 8 }}
        mb={3}
      >
        <Heading display="flex" size="md" mb={{ base: 3, md: 0 }}>
          <span>{$t({ defaultMessage: "Choose a deck to study" })}</span>
          {isRefetching && <SyncSpinner />}
        </Heading>
        <SortingControls<DeckSort["sortBy"]>
          options={[
            {
              label: $t({ defaultMessage: "Name" }),
              value: "name",
            },
            {
              label: $t({ defaultMessage: "Cards count" }),
              value: "cardsCount",
            },
            {
              label: $t({ defaultMessage: "Study cards count" }),
              value: "studyingCardsCount",
            },
            {
              label: $t({ defaultMessage: "Study cards ratio" }),
              value: "studyingCardsPercentage",
            },
            {
              label: $t({ defaultMessage: "Favorite" }),
              value: "isFavorite",
            },
            {
              label: $t({ defaultMessage: "Creation date" }),
              value: "createdAt",
            },
            {
              label: $t({ defaultMessage: "Last modify" }),
              value: "updatedAt",
            },
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
          message={$t({
            defaultMessage: "The deck with cards is required to start studying",
          })}
          actionButtonLabel={$t({ defaultMessage: "Create deck" })}
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
            <Flex
              width="100%"
              direction={{ base: "column", md: "row" }}
              justify={{ base: "flex-start", md: "space-between" }}
              align={{ base: "flex-start", md: "center" }}
              pl={1}
            >
              <Box
                width={{ base: "100%", md: "unset" }}
                mb={{ base: 1.5, md: 0 }}
                opacity={isDisabled ? 0.8 : 1}
              >
                <HStack justify={{ base: "space-between", md: "flex-start" }}>
                  <StatLabel
                    isTruncated
                    maxW="45vw"
                    fontSize="larger"
                    fontWeight="bold"
                  >
                    {deck.name}
                  </StatLabel>
                  <HStack spacing={1}>
                    <Link href={`/decks/${deck.id}`} passHref>
                      <TooltipIconButton
                        tooltipProps={{
                          hasArrow: true,
                          label: $t({ defaultMessage: "Edit deck" }),
                          placement: "top",
                          openDelay: 300,
                        }}
                        onFocus={(e) => e.preventDefault()}
                        colorScheme="purple"
                        aria-label={$t({ defaultMessage: "Edit" })}
                        icon={<MdEdit fontSize="16px" />}
                        variant="outline"
                        size="xs"
                      />
                    </Link>
                    {deck.cards.length > 0 && (
                      <TooltipIconButton
                        tooltipProps={{
                          hasArrow: true,
                          label: $t({ defaultMessage: "Reset deck's cards" }),
                          placement: "top",
                          openDelay: 300,
                        }}
                        onFocus={(e) => e.preventDefault()}
                        colorScheme="purple"
                        aria-label={$t({ defaultMessage: "Reset" })}
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
                {isLargerThanMD && (
                  <StatHelpText fontSize="small">
                    {$t({ defaultMessage: "Cards ready to learn / total" })}
                  </StatHelpText>
                )}
              </Box>
              <Stack direction="column" align="flex-end" spacing={2}>
                {isDisabled ? (
                  <>
                    {deck.cardsCount === 0 ? (
                      <>
                        <Link href={`/decks/${deck.id}?add-card=true`} passHref>
                          <CustomButton
                            size={isLargerThanMD ? "md" : "sm"}
                            colorScheme="purple"
                            variant="outline"
                          >
                            {$t({ defaultMessage: "Build your deck" })}
                          </CustomButton>
                        </Link>
                        {isLargerThanMD && (
                          <Text fontSize="small">
                            {$t({
                              defaultMessage:
                                "Add some cards to start studying",
                            })}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text fontSize="small">
                        {$t({ defaultMessage: "The nearest card to study" })}{" "}
                        {timeToX(deck.nearestStudyTime as number)}
                      </Text>
                    )}
                  </>
                ) : (
                  <Link href={`/study/${deck.id}`} passHref>
                    <CustomButton
                      size={isLargerThanMD ? "md" : "sm"}
                      variant="solid"
                      colorScheme="purple"
                    >
                      {$t({ defaultMessage: "Start studying" })}
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
