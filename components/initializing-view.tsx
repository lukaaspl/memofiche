import { Center, chakra, Fade, Heading, Stack } from "@chakra-ui/react";
import React from "react";

export default function InitializingView(): JSX.Element {
  return (
    <Fade in>
      <Center width="100vw" height="100vh" backgroundColor="purple.500">
        <Stack
          className="animated-logo"
          direction="column"
          spacing={0}
          textAlign="center"
        >
          <Heading color="white" fontFamily="Poppins" fontSize="7xl">
            MF
          </Heading>
          <Heading
            textTransform="uppercase"
            letterSpacing="2px"
            color="white"
            fontSize="2xl"
          >
            <span>M</span>
            <chakra.span opacity={0.8}>emo</chakra.span>
            <span>f</span>
            <chakra.span opacity={0.8}>iche</chakra.span>
          </Heading>
        </Stack>
      </Center>
    </Fade>
  );
}
