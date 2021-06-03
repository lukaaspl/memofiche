import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

export function timeToX(value: number): string {
  return dayjs().to(value);
}
