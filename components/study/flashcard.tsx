import { Box, BoxProps } from "@chakra-ui/react";
import MotionBox from "components/ui/motion-box";
import { DetailedCard, TransformedCard } from "domains/card";
import { AnimatePresence } from "framer-motion";
import useCommonPalette from "hooks/use-common-palette";
import React from "react";
import CardSide from "./card-side";

interface FlashcardProps extends Omit<BoxProps, "id"> {
  card: TransformedCard<DetailedCard>;
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
  const palette = useCommonPalette();

  return (
    <Box w="100%" maxW="600px" h="300px" mx="auto" position="relative">
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
            borderColor={palette.primary}
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
              meta={card.meta}
              isPaused={isPaused}
            />
            <CardSide
              reversed
              content={card.reverse}
              note={card.note}
              meta={card.meta}
              isPaused={isPaused}
            />
          </MotionBox>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
}
