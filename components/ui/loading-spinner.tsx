import {
  Fade,
  CircularProgress,
  CircularProgressProps,
} from "@chakra-ui/react";
import React from "react";

interface LoadingSpinnerProps extends CircularProgressProps {
  delay?: number;
}

export default function LoadingSpinner({
  delay,
  ...circularProgressProps
}: LoadingSpinnerProps): JSX.Element {
  return (
    <Fade
      in
      transition={delay ? { enter: { delay } } : undefined}
      style={{ display: "inline-block" }}
    >
      <CircularProgress
        capIsRound
        isIndeterminate
        color="purple.500"
        {...circularProgressProps}
      />
    </Fade>
  );
}
