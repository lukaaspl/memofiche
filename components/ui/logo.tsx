import { Box, BoxProps, Heading, HeadingProps } from "@chakra-ui/react";
import Span from "components/shared/span";
import useCommonPalette from "hooks/use-common-palette";
import AppVersion from "./app-version";

interface LogoProps extends BoxProps {
  variant: "full" | "abbr";
  size: HeadingProps["fontSize"];
  color?: string;
  isVersionShown?: boolean;
}

export default function Logo({
  variant,
  size,
  color = "white",
  isVersionShown,
  ...boxProps
}: LogoProps): JSX.Element {
  const { blackWhite } = useCommonPalette();

  const logo =
    variant === "abbr" ? (
      <Heading color={color} fontFamily="Poppins" fontSize={size}>
        MF
      </Heading>
    ) : (
      <>
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
        {isVersionShown && <AppVersion textAlign="center" color={blackWhite} />}
      </>
    );

  return <Box {...boxProps}>{logo}</Box>;
}
