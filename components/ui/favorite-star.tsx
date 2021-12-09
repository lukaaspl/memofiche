import { StarIcon } from "@chakra-ui/icons";
import { IconProps } from "@chakra-ui/react";
import useTypedColorModeValue from "hooks/use-typed-color-mode-value";
import React from "react";

export default function FavoriteStar(props: IconProps): JSX.Element {
  const color = useTypedColorModeValue("color")("yellow.500", "yellow.400");
  return <StarIcon color={color} {...props} />;
}
