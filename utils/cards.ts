import { Card } from "@prisma/client";
import { Card as LegacyCard, Nullable } from "domains";
import { CardWithMemoParams } from "domains/deck";
import { isEqual, pick } from "lodash";
import { nanoid } from "nanoid";
import { getInitialSMParams } from "utils/super-memo";

export function createCard(obverse: string, reverse: string): LegacyCard {
  return {
    obverse,
    reverse,
    id: nanoid(),
    nextPractice: Date.now(),
    smParams: getInitialSMParams(),
  };
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function getNextPractice(interval: number): number {
  return Date.now() + interval * DAY_IN_MS;
}

export function isCardReadyToStudy(card: LegacyCard): boolean {
  return card.nextPractice <= Date.now();
}

export function shouldUpdateMemoParams(card1: Card, card2: Card): boolean {
  const consideredFields: (keyof Card)[] = ["obverse", "reverse"];
  const c1 = pick(card1, consideredFields);
  const c2 = pick(card2, consideredFields);

  return !isEqual(c1, c2);
}

export function getReadyToStudyCards<T extends CardWithMemoParams>(
  cards: T[]
): T[] {
  return cards.filter(
    (card) =>
      !card.memoParams?.dueDate ||
      new Date(card.memoParams.dueDate).getTime() <= Date.now()
  );
}

export function revealCardNearestStudyTime(
  cards: CardWithMemoParams[]
): Nullable<number> {
  if (cards.length === 0) {
    return null;
  }

  return cards.reduce((nearestTimestamp, card) => {
    if (card.memoParams?.dueDate) {
      const cardTimestamp = new Date(card.memoParams.dueDate).getTime();

      if (cardTimestamp < nearestTimestamp) {
        return cardTimestamp;
      }
    }

    return nearestTimestamp;
  }, Infinity);
}
