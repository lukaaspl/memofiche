import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Flex,
  Heading,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import CustomList from "components/ui/custom-list";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import useDecksQuery from "hooks/use-decks-query";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import Link from "next/link";
import React, { useMemo } from "react";
import { getReadyToStudyCards, revealCardNearestStudyTime } from "utils/cards";
import { timeToX } from "utils/date-time";

function DecksToStudyList(): JSX.Element {
  const { data: decks, isLoading, error } = useDecksQuery();

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
    return (
      <Box my={5} textAlign="center">
        <Text>An error occurred</Text>
      </Box>
    );
  }

  if (!enhancedSortedDecks || isLoading) {
    return (
      <Box my={5} textAlign="center">
        <CircularProgress isIndeterminate color="purple.500" />
      </Box>
    );
  }

  return (
    <>
      <Heading size="md" mt={5} mb={2}>
        Choose a deck to study
      </Heading>
      <Divider />
      <CustomList
        mt={5}
        items={enhancedSortedDecks}
        selectId={(deck) => deck.id}
        disableItem={(deck) => deck.readyToLearnCardsCount === 0}
        generateLinkHref={(deck) => `/v2/study/${deck.id}`}
        renderItem={(deck) => {
          const isDisabled = deck.readyToLearnCardsCount === 0;

          return (
            <Flex width="100%" justify="space-between" align="center">
              <Stat opacity={isDisabled ? 0.8 : 1}>
                <StatLabel
                  fontSize="larger"
                  fontWeight="bold"
                  color={isDisabled ? "gray.900" : "purple.900"}
                >
                  {deck.name}
                </StatLabel>
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
                        <Link
                          href={`/v2/decks/${deck.id}?add-card=true`}
                          passHref
                        >
                          <Button colorScheme="purple" variant="outline">
                            Build your deck
                          </Button>
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
                  <Button variant="solid" colorScheme="purple">
                    Start studying
                  </Button>
                )}
              </Stack>
            </Flex>
          );
        }}
      />
    </>
  );
}

const StudyPage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>Study</PrimaryHeading>
      <DecksToStudyList />
    </Layout>
  );
};

export default StudyPage;
