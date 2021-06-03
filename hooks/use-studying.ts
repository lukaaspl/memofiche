import { Action, Card, PayloadAction } from "domains";
import produce from "immer";
import { useCallback, useReducer } from "react";

type StudyingState = {
  studyingCards: Card[];
  isCardFlipped: boolean;
  wasCardFlipped: boolean;
} & (
  | {
      isStudying: false;
      hasNextCard: null;
      currentCardIndex: null;
      startedStudyingDate: null;
    }
  | {
      isStudying: true;
      hasNextCard: boolean;
      currentCardIndex: number;
      startedStudyingDate: number;
    }
);

type StartStudyingAction = PayloadAction<"start", Card[]>;
type FlipCardAction = Action<"flip">;
type NextCardAction = Action<"next">;
type FinishStudyingAction = Action<"finish">;

type StudyingActions =
  | StartStudyingAction
  | FlipCardAction
  | NextCardAction
  | FinishStudyingAction;

const initialStudyingState: StudyingState = {
  isStudying: false,
  isCardFlipped: false,
  wasCardFlipped: false,
  studyingCards: [],
  hasNextCard: null,
  currentCardIndex: null,
  startedStudyingDate: null,
};

function studyingReducer(
  state: StudyingState,
  action: StudyingActions
): StudyingState {
  switch (action.type) {
    case "start":
      return produce(state, (draftState) => {
        if (action.payload.length === 0) {
          throw new Error(
            "There must be at least 1 card to start studying process"
          );
        }

        draftState.isStudying = true;
        draftState.studyingCards = action.payload;
        draftState.hasNextCard = action.payload.length > 1;
        draftState.currentCardIndex = 0;
        draftState.startedStudyingDate = Date.now();
      });

    case "flip":
      return produce(state, (draftState) => {
        if (state.currentCardIndex == null) {
          throw new Error(
            "Studying process must be started to execute flip action"
          );
        }

        draftState.isCardFlipped = !state.isCardFlipped;
        draftState.wasCardFlipped = true;
      });

    case "next":
      return produce(state, (draftState) => {
        if (state.currentCardIndex == null) {
          throw new Error(
            "Studying process must be started to execute next action"
          );
        }

        if (!state.hasNextCard) {
          throw new Error(
            "There is no next card on the deck, the process should be finished instead"
          );
        }

        const updatedIndex = state.currentCardIndex + 1;
        const nextCardIndex = updatedIndex + 1;

        draftState.isCardFlipped = false;
        draftState.wasCardFlipped = false;
        draftState.currentCardIndex = updatedIndex;
        draftState.hasNextCard = Boolean(state.studyingCards[nextCardIndex]);
      });

    case "finish":
      return produce(state, () => {
        if (!state.isStudying) {
          throw new Error(
            "Studying process must be started to execute finish action"
          );
        }

        return initialStudyingState;
      });
  }
}

// type UseStudying =

export function useStudying() {
  const [state, dispatch] = useReducer(studyingReducer, initialStudyingState);

  const startStudying = useCallback((studyingCards: Card[]) => {
    dispatch({ type: "start", payload: studyingCards });
  }, []);

  const flipCard = useCallback(() => {
    dispatch({ type: "flip" });
  }, []);

  const nextCard = useCallback(() => {
    dispatch({ type: "next" });
  }, []);

  const finishStudying = useCallback(() => {
    dispatch({ type: "finish" });
  }, []);

  return {
    state,
    startStudying,
    flipCard,
    nextCard,
    finishStudying,
  };
}

export default useStudying;
