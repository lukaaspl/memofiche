import { SMParams } from "domains";
import { getMsFromDays } from "./date-time";

const MIN_EF = 1.3;
const MAX_QUALITY = 5;

function getIntervalBasedDueDate(interval?: number): Date {
  if (!interval) {
    return new Date(Date.now());
  }

  return new Date(Date.now() + getMsFromDays(interval));
}

export function getInitialSMParams(): SMParams {
  return {
    repetitions: 0,
    easiness: 2.5,
    interval: 0,
    dueDate: getIntervalBasedDueDate(),
  };
}

function getEasinessFactor(prevEF: number, quality: number): number {
  const qualityDiff = MAX_QUALITY - quality;

  return Math.max(
    MIN_EF,
    prevEF + 0.1 - qualityDiff * (0.08 + qualityDiff * 0.02)
  );
}

function getInterval(params: SMParams): number {
  const { easiness, repetitions, interval } = params;

  if (repetitions === 0) {
    return 1;
  }

  if (repetitions === 1) {
    return 6;
  }

  return Math.round(interval * easiness);
}

export function superMemo(params: SMParams, rate: number): SMParams {
  const newEF = getEasinessFactor(params.easiness, rate);

  if (rate >= 3) {
    const interval = getInterval(params);

    return {
      easiness: newEF,
      repetitions: params.repetitions + 1,
      interval,
      dueDate: getIntervalBasedDueDate(interval),
    };
  }

  return {
    easiness: newEF,
    repetitions: 0,
    interval: 1,
    dueDate: getIntervalBasedDueDate(1),
  };
}
