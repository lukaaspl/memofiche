import { ButtonProps, Kbd, Stack, StackProps } from "@chakra-ui/react";
import KeyAccessedButton from "components/ui/key-accessed-button";
import Span from "components/ui/span";
import { DetailedCard, TransformedCard } from "domains/card";
import { OmitMotionCollidedProps } from "domains/framer-motion";
import { RatingControlMode } from "domains/study";
import { motion, useIsPresent } from "framer-motion";
import useMe from "hooks/use-me";
import React from "react";
import { getPredictedInterval } from "utils/cards";

const MotionStack = motion<OmitMotionCollidedProps<StackProps>>(Stack);

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

const ADVANCED_RATING_CONTROLS: RatingControl[] = [
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
];

const controlsByMode: Record<RatingControlMode, RatingControl[]> = {
  [RatingControlMode.Basic]: BASIC_RATING_CONTROLS,
  [RatingControlMode.Advanced]: ADVANCED_RATING_CONTROLS,
};

interface RatingControl {
  label: string;
  rate: number;
  shortcut: { label: string; code: string };
  colorScheme?: ButtonProps["colorScheme"];
}

interface RatingControlsProps extends OmitMotionCollidedProps<StackProps> {
  card: TransformedCard<DetailedCard>;
  isShown: boolean;
  isDisabled: boolean;
  controls?: RatingControl[];
  onRate: (rate: number) => void;
}

export default function RatingControls({
  card,
  isShown,
  isDisabled,
  onRate,
  ...stackProps
}: RatingControlsProps): JSX.Element {
  const isPresent = useIsPresent();
  const { config } = useMe();

  const mode = config.advancedRatingControls
    ? RatingControlMode.Advanced
    : RatingControlMode.Basic;

  return (
    <MotionStack
      direction="row"
      spacing={5}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: isShown ? 1 : 0, y: isShown ? 0 : 15 }}
      exit={{ opacity: 0, y: 15, transition: { delay: 0.1 } }}
      transition={{ duration: 0.15 }}
      {...stackProps}
    >
      {controlsByMode[mode].map((control, index) => (
        <KeyAccessedButton
          keyCode={control.shortcut.code}
          key={index}
          fontFamily="Poppins"
          size="lg"
          colorScheme={control.colorScheme}
          onClick={() => onRate(control.rate)}
          isDisabled={isDisabled || !isPresent}
        >
          <Kbd mr={2} color="blackAlpha.700" fontSize="small">
            {control.shortcut.label}
          </Kbd>
          {control.label}
          <Span ml={1} fontSize="xs">
            {getPredictedInterval(card, control.rate)}
          </Span>
        </KeyAccessedButton>
      ))}
    </MotionStack>
  );
}
