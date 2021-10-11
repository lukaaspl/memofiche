import { Heading, HeadingProps } from "@chakra-ui/react";
import React from "react";

export default function PrimaryHeading(props: HeadingProps): JSX.Element {
  return (
    <Heading
      size="lg"
      fontFamily="Poppins"
      letterSpacing="2px"
      textTransform="uppercase"
      {...props}
    />
  );
}
