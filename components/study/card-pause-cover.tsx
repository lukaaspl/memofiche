import { Center, Text } from "@chakra-ui/react";
import MotionBox from "components/ui/motion-box";
import useCommonPalette from "hooks/use-common-palette";
import React from "react";

interface CardPauseCoverProps {
  isPaused: boolean;
}

export default function CardPauseCover({
  isPaused,
}: CardPauseCoverProps): JSX.Element {
  const palette = useCommonPalette();

  return (
    <MotionBox
      position="absolute"
      width="100%"
      height="100%"
      zIndex={1}
      backgroundColor={palette.primary}
      initial={false}
      animate={{ x: isPaused ? 0 : "-100%" }}
      transition={{ type: "spring", duration: 0.35 }}
    >
      <Center h="100%">
        <Text
          fontWeight="bold"
          fontSize="md"
          color={palette.bw}
          textTransform="uppercase"
        >
          Studying is paused
        </Text>
      </Center>
    </MotionBox>
  );
}
