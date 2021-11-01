import { Nullable } from "domains";
import {
  PostStudySessionRequestData,
  StudySessionsAverages,
  StudySessionsDeviations,
} from "domains/study";
import { StudyingHistoryEntry, StudyingState } from "hooks/use-studying";
import { assert } from "./validation";

export function calculateStudyingTotalTime(
  startedDate: number,
  history: StudyingHistoryEntry[]
): number {
  const finishedTime = Date.now();
  const pauseEntries = history.filter((entry) => entry.type === "pause");
  const resumeEntries = history.filter((entry) => entry.type === "resume");

  const breakTime = pauseEntries.reduce((breakTime, pauseEntry, index) => {
    const resumeDate = resumeEntries[index]?.date || finishedTime;
    return breakTime + (resumeDate - pauseEntry.date);
  }, 0);

  return finishedTime - startedDate - breakTime;
}

export function getStudyingSessionSummary(
  state: StudyingState
): PostStudySessionRequestData {
  assert(state.isStarted);

  const studyTime = calculateStudyingTotalTime(
    state.startedDate,
    state.history
  );

  const studiedCards = state.history.filter((entry) => entry.type === "card");

  const studiedCardsCount = studiedCards.length;

  if (studiedCardsCount === 0) {
    throw new Error(
      "There must be at least 1 card to calculate studying summary"
    );
  }

  const cardGrades = studiedCards.reduce<Record<string, number>>(
    (acc, card) => {
      assert(card.type === "card");
      acc[card.cardId] = card.rate;
      return acc;
    },
    {}
  );

  const positiveCards = studiedCards.filter((card) => {
    assert(card.type === "card");
    return card.rate >= 3;
  }).length;

  const negativeCards = studiedCardsCount - positiveCards;

  const avgTimePerCard = studyTime / studiedCardsCount;

  const avgRate =
    state.history.reduce(
      (sum, entry) => (entry.type === "card" ? sum + entry.rate : sum),
      0
    ) / studiedCardsCount;

  return {
    studyTime,
    studiedCards: studiedCardsCount,
    positiveCards,
    negativeCards,
    avgTimePerCard,
    avgRate,
    cardGrades,
  };
}

function getRatio(value: number, average: Nullable<number>): Nullable<number> {
  return average ? value / average - 1 : null;
}

export function getStudySessionsDeviations(
  data: PostStudySessionRequestData,
  currentDeckStudySessionsAvgs: StudySessionsAverages,
  allDecksStudySessionsAvgs: StudySessionsAverages
): StudySessionsDeviations {
  const relativeToCurrentDeck = {
    studyTime: getRatio(data.studyTime, currentDeckStudySessionsAvgs.studyTime),
    avgTimePerCard: getRatio(
      data.avgTimePerCard,
      currentDeckStudySessionsAvgs.avgTimePerCard
    ),
    avgRate: getRatio(data.avgRate, currentDeckStudySessionsAvgs.avgRate),
    studiedCards: getRatio(
      data.studiedCards,
      currentDeckStudySessionsAvgs.studiedCards
    ),
    positiveCards: getRatio(
      data.positiveCards,
      currentDeckStudySessionsAvgs.positiveCards
    ),
    negativeCards: getRatio(
      data.negativeCards,
      currentDeckStudySessionsAvgs.negativeCards
    ),
  };

  const relativeToAllDecks = {
    studyTime: getRatio(data.studyTime, allDecksStudySessionsAvgs.studyTime),
    avgTimePerCard: getRatio(
      data.avgTimePerCard,
      allDecksStudySessionsAvgs.avgTimePerCard
    ),
    avgRate: getRatio(data.avgRate, allDecksStudySessionsAvgs.avgRate),
    studiedCards: getRatio(
      data.studiedCards,
      allDecksStudySessionsAvgs.studiedCards
    ),
    positiveCards: getRatio(
      data.positiveCards,
      allDecksStudySessionsAvgs.positiveCards
    ),
    negativeCards: getRatio(
      data.negativeCards,
      allDecksStudySessionsAvgs.negativeCards
    ),
  };

  return { relativeToCurrentDeck, relativeToAllDecks };
}
