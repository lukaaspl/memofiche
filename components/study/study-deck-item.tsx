import StudyingSessionFinalScreen from "components/study/studying-session-final-screen";
import StudyingSessionProcess from "components/study/studying-session-process";
import Feedback from "components/ui/feedback";
import GoBackButton from "components/ui/go-back-button";
import MotionBox from "components/ui/motion-box";
import PrimaryHeading from "components/ui/primary-heading";
import Span from "components/ui/span";
import { AnimatePresence } from "framer-motion";
import useDeckQuery from "hooks/use-deck-query";
import useStudying from "hooks/use-studying";
import React, { useEffect } from "react";

interface StudyDeckItemProps {
  deckId: number;
}

export default function StudyDeckItem({
  deckId,
}: StudyDeckItemProps): JSX.Element {
  const {
    data: deck,
    isLoading,
    isFetchedAfterMount,
    error: requestError,
  } = useDeckQuery(deckId, undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { state, operations } = useStudying();

  useEffect(() => {
    if (deck && isFetchedAfterMount && !state.isStarted) {
      operations.start(deck.cards);
    }
  }, [deck, isFetchedAfterMount, operations, state.isStarted]);

  if (requestError) {
    return <Feedback type="error" />;
  }

  if (state.error) {
    return <Feedback type="error" message={state.error} />;
  }

  if (!deck || isLoading || !state.isStarted) {
    return <Feedback type="loading" />;
  }

  return (
    <>
      <PrimaryHeading mb={3}>
        Study <Span color="purple.700">{deck.name}</Span>
      </PrimaryHeading>
      <GoBackButton />
      <AnimatePresence initial={false} exitBeforeEnter>
        <MotionBox
          key={Number(state.isFinished)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.5 } }}
        >
          {state.isFinished ? (
            <StudyingSessionFinalScreen state={state} deckId={deckId} />
          ) : (
            <StudyingSessionProcess state={state} operations={operations} />
          )}
        </MotionBox>
      </AnimatePresence>
    </>
  );
}
