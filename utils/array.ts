type PaddedArray<TItem> = ({ index: number } & (
  | { hasValue: true; value: TItem }
  | { hasValue: false }
))[];

export function arrayPadEnd<TItem>(
  array: TItem[],
  minLength: number
): PaddedArray<TItem> {
  return Array.from({ length: minLength }).map((_, index) => {
    if (array[index]) {
      return {
        index,
        hasValue: true,
        value: array[index],
      };
    }

    return {
      index,
      hasValue: false,
    };
  });
}
