import { Kbd, Stack } from "@chakra-ui/react";
import Flashcard from "components/study/flashcard";
import RatingControls from "components/study/rating-controls";
import StudyingProgressBar from "components/study/studying-progress-bar";
import StudyingTopBar from "components/study/studying-top-bar";
import KeyAccessedButton from "components/ui/key-accessed-button";
import { AnimatePresence, useIsPresent } from "framer-motion";
import { StudyingOperations, StudyingState } from "hooks/use-studying";
import React, { useMemo } from "react";
import { StudyCard } from "utils/cards";
import { assert } from "utils/validation";

interface StudyingSessionProcessProps {
  state: StudyingState;
  operations: StudyingOperations;
}

export default function StudyingSessionProcess({
  state,
  operations,
}: StudyingSessionProcessProps): JSX.Element {
  assert(state.isStarted);

  const isPresent = useIsPresent();

  const studyingCardsCount = state.studyingCards.length;

  const currentCard = useMemo(() => {
    const rawCard = state.studyingCards[state.currentCardIndex];
    return new StudyCard(rawCard).produce();
  }, [state.currentCardIndex, state.studyingCards]);

  return (
    <>
      <StudyingTopBar
        isPaused={state.isPaused}
        isFinished={state.isFinished}
        isFinishDisabled={state.currentCardIndex === 0}
        onResume={operations.resume}
        onPause={operations.pause}
        onFinish={operations.finish}
      />
      <StudyingProgressBar
        currentCardIndex={state.currentCardIndex}
        totalCardsCount={studyingCardsCount}
      />
      <Flashcard
        card={currentCard}
        cardsLeft={studyingCardsCount - state.currentCardIndex}
        isFlipped={state.isCardFlipped}
        isPaused={state.isPaused}
      />
      <Stack direction="column" alignItems="center" spacing={14} mt={6}>
        <KeyAccessedButton
          keyCode="KeyF"
          animationTime={0.1}
          onClick={operations.flip}
          fontFamily="Poppins"
          size="md"
          isDisabled={state.isPaused || !isPresent}
          colorScheme="purple"
        >
          <Kbd
            marginRight={2}
            backgroundColor="gray.100"
            color="blackAlpha.900"
            fontSize="small"
          >
            F
          </Kbd>
          Flip the card
        </KeyAccessedButton>
        <AnimatePresence exitBeforeEnter>
          <RatingControls
            key={currentCard.id}
            card={currentCard}
            onRate={operations.next}
            isShown={state.wasCardFlipped}
            isDisabled={!state.wasCardFlipped || state.isPaused || !isPresent}
          />
        </AnimatePresence>
      </Stack>
    </>
  );
}
