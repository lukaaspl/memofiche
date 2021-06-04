import { MemoDetails, MemoQuality } from "domains";

const MAX_EF = 1.3;
const MAX_QUALITY = 5;

export const getDefaultMemoDetails = (): MemoDetails => ({
  repetitions: 0,
  easiness: 2.5,
  interval: 1,
});

function getEasinessFactor(prevEF: number, quality: MemoQuality): number {
  const qualityDiff = MAX_QUALITY - quality;

  return Math.max(
    MAX_EF,
    prevEF + 0.1 - qualityDiff * (0.08 + qualityDiff * 0.02)
  );
}

function getRepetitions(prevRepetitions: number, quality: MemoQuality): number {
  if (quality < 3) {
    return 0;
  }

  return prevRepetitions + 1;
}

function getInterval(
  prevInterval: number,
  repetitions: number,
  easinessFactor: number
): number {
  if (repetitions <= 1) {
    return 1;
  }

  if (repetitions === 2) {
    return 6;
  }

  return Math.round(prevInterval * easinessFactor);
}

export function superMemo<TItem extends MemoDetails>(
  item: TItem,
  quality: MemoQuality
): TItem {
  const easinessFactor = getEasinessFactor(item.easiness, quality);
  const repetitions = getRepetitions(item.repetitions, quality);
  const interval = getInterval(item.interval, repetitions, easinessFactor);

  return {
    ...item,
    easiness: easinessFactor,
    repetitions,
    interval,
  };
}
