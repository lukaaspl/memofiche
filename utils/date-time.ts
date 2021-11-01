import dayjs from "dayjs";

export function getMsFromDays(days: number): number {
  return days * 1000 * 60 * 60 * 24;
}

export function timeToX(value: number): string {
  return dayjs().to(value);
}

export function prettyDuration(ms: number, upToUnits = 2): string {
  const d = dayjs.duration(ms);

  if (ms < 1000) {
    return `${ms.toFixed()}ms`;
  }

  if (ms < 1000 * 60) {
    return `${(ms / 1000).toFixed(2)}s`;
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
    .join(" ");
}
