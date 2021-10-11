import { Card } from ".prisma/client";
import {
  Box,
  CircularProgress,
  Progress,
  Text,
  ProgressLabel,
  Heading,
  Center,
  Button,
  Flex,
} from "@chakra-ui/react";
import { AnimatedSkeletonStack } from "components/ui/animated-skeleton";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import useDeckQuery from "hooks/use-deck-query";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getReadyToStudyCards } from "utils/cards";

interface CardOrnamentProps {
  position: "top-left" | "bottom-right";
  text: string;
}

function CardOrnament({ position, text }: CardOrnamentProps): JSX.Element {
  const isTopLeft = position === "top-left";

  return (
    <Heading
      position="absolute"
      top={isTopLeft ? 2 : undefined}
      bottom={isTopLeft ? undefined : 2}
      left={isTopLeft ? 2 : undefined}
      right={isTopLeft ? undefined : 2}
      fontSize="sm"
      fontFamily="Poppins"
      fontWeight="bold"
      color="purple.500"
      textTransform="uppercase"
      textAlign="center"
      userSelect="none"
    >
      {text}
    </Heading>
  );
}

interface FlashcardProps {
  obverse: string;
  reverse: string;
  isFlipped: boolean;
}

function Flashcard({
  obverse,
  reverse,
  isFlipped,
}: FlashcardProps): JSX.Element {
  return (
    <Box
      backgroundColor="transparent"
      width="600px"
      height="300px"
      mx="auto"
      sx={{ perspective: "1000px" }}
    >
      <Box
        position="relative"
        width="100%"
        height="100%"
        border="2px solid"
        borderColor="purple.500"
        borderRightWidth="8px"
        transition="transform 0.5s ease"
        transform={isFlipped ? "rotateX(180deg)" : undefined}
        sx={{ transformStyle: "preserve-3d" }}
      >
        <Center
          position="absolute"
          width="100%"
          height="100%"
          boxShadow="lg"
          sx={{ backfaceVisibility: "hidden" }}
        >
          <CardOrnament position="top-left" text="Obverse" />
          <CardOrnament position="bottom-right" text="Obverse" />
          <Text fontFamily="Poppins" fontSize="lg">
            {obverse}
          </Text>
        </Center>
        <Center
          position="absolute"
          width="100%"
          height="100%"
          boxShadow="lg"
          sx={{ backfaceVisibility: "hidden" }}
          backgroundColor="white"
          transform="rotateX(180deg)"
        >
          <CardOrnament position="top-left" text="Reverse" />
          <CardOrnament position="bottom-right" text="Reverse" />
          <Text fontFamily="Poppins" fontSize="lg">
            {reverse}
          </Text>
        </Center>
      </Box>
    </Box>
  );
}

interface StudyDeckItemProps {
  deckId: number;
}

function StudyDeckItem({ deckId }: StudyDeckItemProps): JSX.Element {
  const { data: deck, isLoading, isRefetching, error } = useDeckQuery(deckId);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (error) {
    return (
      <Box my={5} textAlign="center">
        <Text>An error occurred</Text>
      </Box>
    );
  }

  if (!deck || isLoading) {
    return (
      <Box my={5} textAlign="center">
        <CircularProgress isIndeterminate color="purple.500" />
      </Box>
    );
  }

  const readyToStudyCards = getReadyToStudyCards(deck.cards);
  const readyToStudyCardsCount = readyToStudyCards.length;
  const isHalfway = currentCardIndex + 1 > readyToStudyCardsCount / 2;

  return (
    <>
      <PrimaryHeading mb={3}>
        Study{" "}
        <Text as="span" color="purple.700">
          {deck.name}
        </Text>
      </PrimaryHeading>
      <Link href="/v2/study" passHref>
        <Button variant="link">&laquo; Back to decks</Button>
      </Link>
      <Box mt={8}>
        <Progress
          borderRadius="md"
          mb={14}
          colorScheme="purple"
          height="35px"
          min={0}
          max={readyToStudyCardsCount}
          value={currentCardIndex + 1}
        >
          <ProgressLabel fontSize="lg" color={isHalfway ? "white" : "black"}>
            {currentCardIndex + 1}/{readyToStudyCardsCount}
          </ProgressLabel>
        </Progress>
        <Flashcard
          obverse={deck.cards[currentCardIndex].obverse}
          reverse={deck.cards[currentCardIndex].reverse}
          isFlipped={isFlipped}
        />
        <Flex mt={10} justify="center">
          <Button
            onClick={() => setIsFlipped((s) => !s)}
            fontFamily="Poppins"
            size="lg"
            colorScheme="purple"
          >
            Flip &amp; Rate
          </Button>
        </Flex>
      </Box>
    </>
  );
}

const StudyDeckPage: NextPage = () => {
  const router = useRouter();
  const deckId = Number(router.query.deckId);

  usePrivateRoute();

  return (
    <Layout>
      <StudyDeckItem deckId={deckId} />
    </Layout>
  );
};

export default StudyDeckPage;
