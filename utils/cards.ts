import { Card as LegacyCard } from "domains";
import { Card } from "@prisma/client";
import { nanoid } from "nanoid";
import { getDefaultMemoDetails } from "utils/super-memo";
import { pick, isEqual } from "lodash";

export function createCard(obverse: string, reverse: string): LegacyCard {
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

export function isCardReadyToStudy(card: LegacyCard): boolean {
  return card.nextPractice <= Date.now();
}

export function shouldUpdateMemoDetails(card1: Card, card2: Card): boolean {
  const consideredFields: (keyof Card)[] = ["obverse", "reverse"];
  const c1 = pick(card1, consideredFields);
  const c2 = pick(card2, consideredFields);

  return !isEqual(c1, c2);
}
