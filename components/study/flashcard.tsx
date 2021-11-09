import {
  Box,
  BoxProps,
  Center,
  Heading,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import MotionBox from "components/ui/motion-box";
import { DetailedCard } from "domains/card";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { InfoIcon } from "@chakra-ui/icons";
import { Nullable } from "domains";

interface CardPauseCoverProps {
  isPaused: boolean;
}

function CardPauseCover({ isPaused }: CardPauseCoverProps): JSX.Element {
  return (
    <MotionBox
      position="absolute"
      width="100%"
      height="100%"
      zIndex={1}
      backgroundColor="purple.500"
      initial={false}
      animate={{ x: isPaused ? 0 : "-100%" }}
      transition={{ type: "spring", duration: 0.35 }}
    >
      <Center h="100%">
        <Text
          fontWeight="bold"
          fontSize="md"
          color="whiteAlpha.900"
          textTransform="uppercase"
        >
          Studying is paused
        </Text>
      </Center>
    </MotionBox>
  );
}

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

interface CardSideProps {
  content: string;
  note: Nullable<string>;
  isPaused: boolean;
  reversed?: boolean;
}

function CardSide({
  content,
  isPaused,
  reversed = false,
  note,
}: CardSideProps): JSX.Element {
  const isReversed = reversed;

  return (
    <Center
      position="absolute"
      width="100%"
      height="100%"
      boxShadow="lg"
      sx={{ backfaceVisibility: "hidden" }}
      backgroundColor="transparent"
      transform={isReversed ? "rotateX(180deg)" : undefined}
      overflow="hidden"
    >
      <CardPauseCover isPaused={isPaused} />
      <CardOrnament
        position="top-left"
        text={isReversed ? "Reverse" : "Obverse"}
      />
      <CardOrnament
        position="bottom-right"
        text={isReversed ? "Reverse" : "Obverse"}
      />
      {note && (
        <Tooltip
          hasArrow
          label={note}
          fontSize="md"
          padding={2}
          placement="top"
        >
          <InfoIcon
            cursor="help"
            position="absolute"
            right={2}
            top={2}
            color="blue.500"
            fontSize="xl"
          />
        </Tooltip>
      )}
      <Center height="75%">
        <Text
          className="primary-sc"
          fontFamily="Poppins"
          fontSize="lg"
          wordBreak="break-word"
          overflow="auto"
          maxHeight="100%"
          paddingX={3}
          textAlign="center"
        >
          {content}
        </Text>
      </Center>
    </Center>
  );
}

interface FlashcardProps extends Omit<BoxProps, "id"> {
  card: DetailedCard;
  cardsLeft: number;
  isFlipped: boolean;
  isPaused: boolean;
}

const FRAME_WIDTH_PER_CARD = 2;
const FRAME_CONSIDERED_CARDS_COUNT = 5;

export default function Flashcard({
  card,
  cardsLeft,
  isFlipped,
  isPaused,
}: FlashcardProps): JSX.Element {
  return (
    <Box w="600px" h="300px" mx="auto" position="relative">
      <AnimatePresence initial={false}>
        <MotionBox
          key={card.id}
          w="100%"
          height="100%"
          position="absolute"
          left={0}
          top={0}
          backgroundColor="transparent"
          sx={{ perspective: "1000px" }}
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "50%" }}
        >
          <MotionBox
            width="100%"
            height="100%"
            border={`${FRAME_WIDTH_PER_CARD}px solid`}
            borderColor="purple.500"
            initial={false}
            animate={{
              rotateX: isFlipped ? 180 : 0,
              borderLeftWidth: Math.min(
                FRAME_CONSIDERED_CARDS_COUNT * FRAME_WIDTH_PER_CARD,
                cardsLeft * FRAME_WIDTH_PER_CARD
              ),
            }}
            exit={{ borderLeftWidth: FRAME_WIDTH_PER_CARD }}
            transition={{
              borderLeftWidth: { duration: 0 },
              default: { type: "spring", mass: 0.5 },
            }}
            sx={{ transformStyle: "preserve-3d" }}
          >
            <CardSide
              content={card.obverse}
              note={card.note}
              isPaused={isPaused}
            />
            <CardSide
              reversed
              content={card.reverse}
              note={card.note}
              isPaused={isPaused}
            />
          </MotionBox>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
}
