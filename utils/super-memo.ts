import { MemoDetails } from "domains";

const MAX_EF = 1.3;
const MAX_QUALITY = 5;

export const getDefaultMemoDetails = (): MemoDetails => ({
  repetitions: 0,
  easiness: 2.5,
  interval: 1,
});

function getEasinessFactor(prevEF: number, quality: number): number {
  const qualityDiff = MAX_QUALITY - quality;

  return Math.max(
    MAX_EF,
    prevEF + 0.1 - qualityDiff * (0.08 + qualityDiff * 0.02)
  );
}

function getRepetitions(prevRepetitions: number, quality: number): number {
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

export function superMemo(details: MemoDetails, quality: number): MemoDetails {
  const easiness = getEasinessFactor(details.easiness, quality);
  const repetitions = getRepetitions(details.repetitions, quality);
  const interval = getInterval(details.interval, repetitions, easiness);

  return { easiness, repetitions, interval };
}
