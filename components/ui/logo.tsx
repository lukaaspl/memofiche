import { Heading, HeadingProps, Box, BoxProps } from "@chakra-ui/react";
import Span from "components/shared/span";

interface LogoProps extends BoxProps {
  variant: "full" | "abbr";
  size: HeadingProps["fontSize"];
}

export default function Logo({
  variant,
  size,
  ...boxProps
}: LogoProps): JSX.Element {
  const logo =
    variant === "abbr" ? (
      <Heading fontSize={size}>MF</Heading>
    ) : (
      <Heading fontSize={size} textTransform="uppercase" letterSpacing="2px">
        <Span>M</Span>
        <Span opacity={0.8}>emo</Span>
        <Span>f</Span>
        <Span opacity={0.8}>iche</Span>
      </Heading>
    );

  return (
    <Box color="white" fontFamily="Poppins" {...boxProps}>
      {logo}
    </Box>
  );
}
