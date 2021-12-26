import { Kbd, Stack, StackProps } from "@chakra-ui/react";
import KeyAccessedButton from "components/shared/key-accessed-button";
import Span from "components/shared/span";
import { DetailedCard, TransformedCard } from "domains/card";
import { OmitMotionCollidedProps } from "domains/framer-motion";
import { RatingControlMode } from "domains/study";
import { motion, useIsPresent } from "framer-motion";
import useMe from "hooks/use-me";
import useRatingControls, { RatingControl } from "hooks/use-rating-controls";
import useScreenWidth from "hooks/use-screen-width";
import React from "react";
import { FormattedMessage } from "react-intl";
import { getPredictedIntervalInDays } from "utils/cards";

const MotionStack = motion<OmitMotionCollidedProps<StackProps>>(Stack);

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
  const { isLargerThanMD } = useScreenWidth();

  const mode = config.advancedRatingControls
    ? RatingControlMode.Advanced
    : RatingControlMode.Basic;

  const ratingControls = useRatingControls(mode);

  return (
    <MotionStack
      width="100%"
      direction={{ base: "column", md: "row" }}
      justify="center"
      spacing={{ base: 3, md: 5 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: isShown ? 1 : 0, y: isShown ? 0 : 15 }}
      exit={{ opacity: 0, y: 15, transition: { delay: 0.1 } }}
      transition={{ duration: 0.15 }}
      {...stackProps}
    >
      {ratingControls.map((control, index) => (
        <KeyAccessedButton
          keyCode={control.shortcut.code}
          key={index}
          fontFamily="Poppins"
          size={isLargerThanMD ? "lg" : "md"}
          colorScheme={control.colorScheme}
          onClick={() => onRate(control.rate)}
          isDisabled={isDisabled || !isPresent}
        >
          {isLargerThanMD && (
            <Kbd
              mr={2}
              backgroundColor="gray.100"
              color="blackAlpha.900"
              fontSize="small"
            >
              {control.shortcut.label}
            </Kbd>
          )}
          {control.label}
          <Span ml={1} fontSize="xs">
            <FormattedMessage
              defaultMessage="(+{daysCount, plural, =1 {# day} other {# days}})"
              values={{
                daysCount: getPredictedIntervalInDays(card, control.rate),
              }}
            />
          </Span>
        </KeyAccessedButton>
      ))}
    </MotionStack>
  );
}
