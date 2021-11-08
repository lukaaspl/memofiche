import dayjs from "dayjs";

export function getMsFromDays(days: number): number {
  return days * 1000 * 60 * 60 * 24;
}

export function timeToX(value: number): string {
  return dayjs().to(value);
}

interface PrettyDurationOptions {
  upToUnits?: number;
  spaceBetweenTags?: boolean;
  milliseconds?: boolean;
  decimals?: boolean;
}

export function prettyDuration(
  ms: number,
  options: PrettyDurationOptions = {}
): string {
  const {
    upToUnits = 2,
    spaceBetweenTags = true,
    milliseconds = false,
    decimals = false,
  } = options;

  const d = dayjs.duration(ms);

  // if shorter than a second
  if (ms < 1000) {
    return milliseconds ? `${ms.toFixed()}ms` : "0s";
  }

  // if shorter than a minute
  if (ms < 1000 * 60) {
    return `${(ms / 1000).toFixed(decimals ? 2 : 0)}s`;
  }

  const tags = [
    { unit: "h", value: d.hours() },
    { unit: "m", value: d.minutes() },
    { unit: "s", value: d.seconds() },
  ];

  return tags
    .filter((tag) => tag.value > 0)
    .slice(0, upToUnits)
    .map((tag) => `${tag.value}${tag.unit}`)
    .join(spaceBetweenTags ? " " : "");
}

export function formatTickValue(dateMs: number): string {
  const date = dayjs(dateMs);

  return date.isToday() ? "Today" : date.format("MMM DD");
}
