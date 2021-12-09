import { Heading } from "@chakra-ui/react";
import useCommonPalette from "hooks/use-common-palette";
import React from "react";

interface CardOrnamentProps {
  position: "top-left" | "bottom-right";
  text: string;
}

export default function CardOrnament({
  position,
  text,
}: CardOrnamentProps): JSX.Element {
  const palette = useCommonPalette();
  const isTopLeft = position === "top-left";

  return (
    <Heading
      position="absolute"
      top={isTopLeft ? 2 : undefined}
      bottom={isTopLeft ? undefined : 2}
      left={isTopLeft ? 2 : undefined}
      right={isTopLeft ? undefined : 2}
      fontSize="sm"
      fontFamily="Poppins"
      fontWeight="bold"
      color={palette.primary}
      textTransform="uppercase"
      textAlign="center"
      userSelect="none"
    >
      {text}
    </Heading>
  );
}
