import StudyingSessionFinalScreen from "components/study/studying-session-final-screen";
import StudyingSessionProcess from "components/study/studying-session-process";
import Feedback from "components/shared/feedback";
import GoBackButton from "components/shared/go-back-button";
import MotionBox from "components/shared/motion-box";
import PrimaryHeading from "components/shared/primary-heading";
import Span from "components/shared/span";
import { AnimatePresence } from "framer-motion";
import useCommonPalette from "hooks/use-common-palette";
import useDeckQuery from "hooks/use-deck-query";
import useStudying, { StudyingErrorCode } from "hooks/use-studying";
import useTranslation from "hooks/use-translation";
import React, { useEffect, useMemo } from "react";

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
  const { $t } = useTranslation();
  const palette = useCommonPalette();

  const studyingErrors = useMemo<Record<StudyingErrorCode, string>>(
    () => ({
      // translated, because this message exceptionally could be displayed on UI
      NOT_ALLOWED_START: $t({
        defaultMessage:
          "There must be at least 1 ready to study card to start studying process",
      }),
      NOT_ALLOWED_FLIP:
        "Studying process must be started to execute flip action",
      NOT_ALLOWED_NEXT:
        "Studying process must be started to execute next action",
      NOT_ALLOWED_FINISH:
        "Studying process must be started to execute finish action",
      NOT_ALLOWED_RESTART:
        "Studying process must be finished to execute restart action",
      ALREADY_PAUSED: "Studying process was already paused",
      ALREADY_RESUMED: "Studying process was already resumed",
    }),
    [$t]
  );

  useEffect(() => {
    if (deck && isFetchedAfterMount && !state.isStarted) {
      operations.start(deck.cards);
    }
  }, [deck, isFetchedAfterMount, operations, state.isStarted]);

  if (requestError) {
    return <Feedback type="error" />;
  }

  if (state.errorCode) {
    return <Feedback type="error" message={studyingErrors[state.errorCode]} />;
  }

  if (!deck || isLoading || !state.isStarted) {
    return <Feedback type="loading" />;
  }

  return (
    <>
      <PrimaryHeading mb={3}>
        {$t(
          { defaultMessage: "Study {deckName}" },
          { deckName: <Span color={palette.primaryDark}>{deck.name}</Span> }
        )}
      </PrimaryHeading>
      <GoBackButton />
      <AnimatePresence initial={false} exitBeforeEnter>
        <MotionBox
          mt={{ base: 5, md: 8 }}
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
