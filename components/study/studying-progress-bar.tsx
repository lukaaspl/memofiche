import { Progress, ProgressLabel } from "@chakra-ui/react";
import useCommonPalette from "hooks/use-common-palette";
import React from "react";

interface StudyingProgressBarProps {
  currentCardIndex: number;
  totalCardsCount: number;
}

export default function StudyingProgressBar({
  currentCardIndex,
  totalCardsCount,
}: StudyingProgressBarProps): JSX.Element {
  const palette = useCommonPalette();
  const isHalfway = currentCardIndex + 1 > totalCardsCount / 2;

  return (
    <Progress
      borderRadius="md"
      mb={{ base: 7, md: 14 }}
      colorScheme="purple"
      height="35px"
      min={0}
      max={totalCardsCount}
      value={currentCardIndex + 1}
      sx={{
        "& [role=progressbar]": {
          transition: "width 0.15s ease",
          willChange: "width",
        },
      }}
    >
      <ProgressLabel fontSize="lg" color={isHalfway ? palette.bw : "undefined"}>
        {currentCardIndex + 1}/{totalCardsCount}
      </ProgressLabel>
    </Progress>
  );
}
