import { ButtonProps, Kbd, Stack, StackProps } from "@chakra-ui/react";
import KeyAccessedButton from "components/ui/key-accessed-button";
import { DetailedCard } from "domains/card";
import React from "react";
import { getPredictedInterval } from "utils/cards";

const BASIC_RATING_CONTROLS: RatingControl[] = [
  {
    label: "Hard",
    rate: 1,
    colorScheme: "red",
    shortcut: { label: "1", code: "Digit1" },
  },
  {
    label: "Good",
    rate: 3,
    colorScheme: "yellow",
    shortcut: { label: "2", code: "Digit2" },
  },
  {
    label: "Easy",
    rate: 5,
    colorScheme: "green",
    shortcut: { label: "3", code: "Digit3" },
  },
];

interface RatingControl {
  label: string;
  rate: number;
  shortcut: { label: string; code: string };
  colorScheme?: ButtonProps["colorScheme"];
}

interface RatingControlsProps extends StackProps {
  card: DetailedCard;
  isDisabled: boolean;
  controls?: RatingControl[];
  onRate: (rate: number) => void;
}

export default function RatingControls({
  card,
  isDisabled,
  controls = BASIC_RATING_CONTROLS,
  onRate,
  ...stackProps
}: RatingControlsProps): JSX.Element {
  return (
    <Stack direction="row" spacing={5} {...stackProps}>
      {controls.map((control, index) => (
        <KeyAccessedButton
          keyCode={control.shortcut.code}
          key={index}
          fontFamily="Poppins"
          size="lg"
          colorScheme={control.colorScheme}
          onClick={() => onRate(control.rate)}
          isDisabled={isDisabled}
        >
          <Kbd mr={2} color="blackAlpha.700" fontSize="small">
            {control.shortcut.label}
          </Kbd>
          {control.label} {getPredictedInterval(card, control.rate)}
        </KeyAccessedButton>
      ))}
    </Stack>
  );
}
