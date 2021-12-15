import { Card, CardType } from "@prisma/client";
import { Nullable } from "domains";
import {
  CardWithMemoParams,
  DetailedCard,
  CardMeta,
  TransformedCard,
} from "domains/card";
import { isEqual, pick } from "lodash";
import { superMemo } from "utils/super-memo";

export function shouldUpdateMemoParams(card1: Card, card2: Card): boolean {
  const consideredFields: (keyof Card)[] = ["obverse", "reverse"];
  const c1 = pick(card1, consideredFields);
  const c2 = pick(card2, consideredFields);

  return !isEqual(c1, c2);
}

export function getCardDueDate<T extends CardWithMemoParams>(card: T): Date {
  if (!card.memoParams) {
    throw new Error("Card has not memo params assigned");
  }

  return new Date(card.memoParams.dueDate);
}

export function getReadyToStudyCards<T extends CardWithMemoParams>(
  cards: T[]
): T[] {
  return cards.filter((card) => getCardDueDate(card).getTime() <= Date.now());
}

export function revealCardNearestStudyTime(
  cards: CardWithMemoParams[]
): Nullable<number> {
  if (cards.length === 0) {
    return null;
  }

  return cards.reduce((nearestTimestamp, card) => {
    const cardTimestamp = getCardDueDate(card).getTime();

    return Math.min(cardTimestamp, nearestTimestamp);
  }, Infinity);
}

export function getPredictedIntervalInDays(
  card: DetailedCard,
  rate: number
): Nullable<number> {
  if (!card?.memoParams) {
    return null;
  }

  const intervalInDays = superMemo(card.memoParams, rate).interval;

  return intervalInDays;
}

export class StudyCard<TCard extends Card> {
  private rawCard: TCard;
  private meta: CardMeta = { isSwapped: false };

  constructor(card: TCard) {
    this.rawCard = card;
  }

  private transform(card: TCard): TransformedCard<TCard> {
    const transformedCard = [this.swapCardSides.bind(this)].reduce(
      (result, transformer) => transformer(result),
      card
    );

    return {
      ...transformedCard,
      meta: this.meta,
    };
  }

  private swapCardSides(card: TCard): TCard {
    const shouldSwap = card.type === CardType.Reverse && Math.random() > 0.5;

    if (shouldSwap) {
      this.meta.isSwapped = true;

      return {
        ...card,
        obverse: card.reverse,
        reverse: card.obverse,
      };
    }

    return card;
  }

  getRawCard(): TCard {
    return this.rawCard;
  }

  produce(): TransformedCard<TCard> {
    return this.transform(this.getRawCard());
  }
}
