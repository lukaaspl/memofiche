import { RatingControlMode } from "domains/study";
import { useMemo } from "react";
import useTranslation from "hooks/use-translation";
import { ButtonProps } from "@chakra-ui/react";

export interface RatingControl {
  label: string;
  rate: number;
  shortcut: { label: string; code: string };
  colorScheme?: ButtonProps["colorScheme"];
}

export default function useRatingControls(
  mode: RatingControlMode
): RatingControl[] {
  const { $t } = useTranslation();

  const basicControls = useMemo<RatingControl[]>(
    () => [
      {
        label: $t({ defaultMessage: "Hard" }),
        rate: 1,
        colorScheme: "red",
        shortcut: { label: "1", code: "Digit1" },
      },
      {
        label: $t({ defaultMessage: "Good" }),
        rate: 3,
        colorScheme: "yellow",
        shortcut: { label: "2", code: "Digit2" },
      },
      {
        label: $t({ defaultMessage: "Easy" }),
        rate: 5,
        colorScheme: "green",
        shortcut: { label: "3", code: "Digit3" },
      },
    ],
    [$t]
  );

  const advancedControls = useMemo<RatingControl[]>(
    () => [
      {
        label: "1",
        rate: 1,
        colorScheme: "red",
        shortcut: { label: "1", code: "Digit1" },
      },
      {
        label: "2",
        rate: 2,
        colorScheme: "red",
        shortcut: { label: "2", code: "Digit2" },
      },
      {
        label: "3",
        rate: 3,
        colorScheme: "yellow",
        shortcut: { label: "3", code: "Digit3" },
      },
      {
        label: "4",
        rate: 4,
        colorScheme: "yellow",
        shortcut: { label: "4", code: "Digit4" },
      },
      {
        label: "5",
        rate: 5,
        colorScheme: "green",
        shortcut: { label: "5", code: "Digit5" },
      },
    ],
    []
  );

  const controlsByMode = useMemo(
    () => ({
      [RatingControlMode.Basic]: basicControls,
      [RatingControlMode.Advanced]: advancedControls,
    }),
    [basicControls, advancedControls]
  );

  return controlsByMode[mode];
}
