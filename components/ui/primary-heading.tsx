import { Heading } from "@chakra-ui/react";
import React from "react";

interface PrimaryHeadingProps {
  children: React.ReactNode;
}

export default function PrimaryHeading({
  children,
}: PrimaryHeadingProps): JSX.Element {
  return (
    <Heading
      size="lg"
      fontFamily="Poppins"
      letterSpacing="2px"
      textTransform="uppercase"
    >
      {children}
    </Heading>
  );
}
