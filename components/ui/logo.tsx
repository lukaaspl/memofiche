import { Heading, HeadingProps, Box, BoxProps } from "@chakra-ui/react";
import Span from "components/shared/span";

interface LogoProps extends BoxProps {
  variant: "full" | "abbr";
  size: HeadingProps["fontSize"];
  color?: string;
}

export default function Logo({
  variant,
  size,
  color = "white",
  ...boxProps
}: LogoProps): JSX.Element {
  const logo =
    variant === "abbr" ? (
      <Heading color={color} fontFamily="Poppins" fontSize={size}>
        MF
      </Heading>
    ) : (
      <Heading
        color={color}
        fontFamily="Poppins"
        fontSize={size}
        textTransform="uppercase"
        letterSpacing="2px"
      >
        <Span>M</Span>
        <Span opacity={0.8}>emo</Span>
        <Span>f</Span>
        <Span opacity={0.8}>iche</Span>
      </Heading>
    );

  return <Box {...boxProps}>{logo}</Box>;
}
