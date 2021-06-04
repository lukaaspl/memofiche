import { Card } from "domains";
import { nanoid } from "nanoid";
import { getDefaultMemoDetails } from "utils/super-memo";

export function createCard(obverse: string, reverse: string): Card {
  return {
    obverse,
    reverse,
    id: nanoid(),
    nextPractice: Date.now(),
    memoDetails: getDefaultMemoDetails(),
  };
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function getNextPractice(interval: number): number {
  return Date.now() + interval * DAY_IN_MS;
}

export function isCardReadyToStudy(card: Card): boolean {
  return card.nextPractice <= Date.now();
}
