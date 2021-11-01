import { Action, Nullable, PayloadAction } from "domains";
import { DetailedCard } from "domains/card";
import produce from "immer";
import { shuffle } from "lodash";
import { useCallback, useMemo, useReducer } from "react";
import { getReadyToStudyCards } from "utils/cards";

export type StudyingHistoryEntry =
  | {
      type: "card";
      cardId: number;
      rate: number;
      date: number;
    }
  | { type: "pause"; date: number }
  | { type: "resume"; date: number };

export type StudyingState = {
  studyingCards: DetailedCard[];
  history: StudyingHistoryEntry[];
  isCardFlipped: boolean;
  wasCardFlipped: boolean;
  isFinished: boolean;
  isPaused: boolean;
  error: Nullable<string>;
} & (
  | {
      isStarted: false;
      hasNextCard: null;
      currentCardIndex: null;
      startedDate: null;
    }
  | {
      isStarted: true;
      hasNextCard: boolean;
      currentCardIndex: number;
      startedDate: number;
    }
);

type StartStudyingAction = PayloadAction<"start", DetailedCard[]>;
type FlipCardAction = Action<"flip">;
type NextCardAction = PayloadAction<"next", { rate: number }>;
type FinishStudyingAction = Action<"finish">;
type RestartStudyingAction = PayloadAction<"restart", DetailedCard[]>;
type PauseStudyingAction = Action<"pause">;
type ResumeStudyingAction = Action<"resume">;

type StudyingActions =
  | StartStudyingAction
  | FlipCardAction
  | NextCardAction
  | FinishStudyingAction
  | RestartStudyingAction
  | PauseStudyingAction
  | ResumeStudyingAction;

export interface StudyingOperations {
  start: (deckCards: DetailedCard[]) => void;
  restart: (deckCards: DetailedCard[]) => void;
  pause: () => void;
  resume: () => void;
  flip: () => void;
  next: (rate: number) => void;
  finish: () => void;
}

export interface UseStudying {
  state: StudyingState;
  operations: StudyingOperations;
}

const initialStudyingState: StudyingState = {
  studyingCards: [],
  history: [],
  isStarted: false,
  isFinished: false,
  isPaused: false,
  isCardFlipped: false,
  wasCardFlipped: false,
  error: null,
  hasNextCard: null,
  currentCardIndex: null,
  startedDate: null,
};

function studyingReducer(
  state: StudyingState,
  action: StudyingActions
): StudyingState {
  switch (action.type) {
    case "start":
      return produce(state, (draftState) => {
        const studyingCards = shuffle(getReadyToStudyCards(action.payload));

        if (studyingCards.length === 0) {
          draftState.error =
            "There must be at least 1 ready to study card to start studying process";
          return;
        }

        draftState.isStarted = true;
        draftState.studyingCards = studyingCards;
        draftState.hasNextCard = studyingCards.length > 1;
        draftState.currentCardIndex = 0;
        draftState.startedDate = Date.now();
      });

    case "flip":
      return produce(state, (draftState) => {
        if (state.currentCardIndex == null) {
          draftState.error =
            "Studying process must be started to execute flip action";
          return;
        }

        draftState.isCardFlipped = !state.isCardFlipped;
        draftState.wasCardFlipped = true;
      });

    case "next":
      return produce(state, (draftState) => {
        if (state.currentCardIndex == null) {
          draftState.error =
            "Studying process must be started to execute next action";
          return;
        }

        draftState.history.push({
          type: "card",
          cardId: state.studyingCards[state.currentCardIndex].id,
          date: Date.now(),
          rate: action.payload.rate,
        });

        if (state.hasNextCard) {
          const updatedIndex = state.currentCardIndex + 1;
          const nextCardIndex = updatedIndex + 1;

          draftState.isCardFlipped = false;
          draftState.wasCardFlipped = false;
          draftState.currentCardIndex = updatedIndex;
          draftState.hasNextCard = Boolean(state.studyingCards[nextCardIndex]);
        } else {
          draftState.isFinished = true;
        }
      });

    case "pause":
      return produce(state, (draftState) => {
        if (state.isPaused) {
          draftState.error = "Studying process was already paused";
          return;
        }

        draftState.history.push({
          type: "pause",
          date: Date.now(),
        });

        draftState.isPaused = true;
      });

    case "resume":
      return produce(state, (draftState) => {
        if (!state.isPaused) {
          draftState.error = "Studying process was already resumed";
          return;
        }

        draftState.history.push({
          type: "resume",
          date: Date.now(),
        });

        draftState.isPaused = false;
      });

    case "finish":
      return produce(state, (draftState) => {
        if (!state.isStarted) {
          draftState.error =
            "Studying process must be started to execute finish action";
          return;
        }

        draftState.isFinished = true;
      });

    case "restart":
      return produce(state, (draftState) => {
        if (!state.isFinished) {
          draftState.error =
            "Studying process must be finished to execute restart action";
          return;
        }

        return {
          ...initialStudyingState,
          ...studyingReducer(draftState, {
            type: "start",
            payload: action.payload,
          }),
        };
      });
  }
}

export function useStudying(): UseStudying {
  const [state, dispatch] = useReducer(studyingReducer, initialStudyingState);

  const start = useCallback((deckCards: DetailedCard[]) => {
    dispatch({ type: "start", payload: deckCards });
  }, []);

  const restart = useCallback((deckCards: DetailedCard[]) => {
    dispatch({ type: "restart", payload: deckCards });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: "pause" });
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: "resume" });
  }, []);

  const flip = useCallback(() => {
    dispatch({ type: "flip" });
  }, []);

  const next = useCallback((rate: number) => {
    dispatch({ type: "next", payload: { rate } });
  }, []);

  const finish = useCallback(() => {
    dispatch({ type: "finish" });
  }, []);

  const operations = useMemo(
    () => ({
      start,
      restart,
      pause,
      resume,
      flip,
      next,
      finish,
    }),
    [finish, flip, next, pause, restart, resume, start]
  );

  return { state, operations };
}

export default useStudying;
