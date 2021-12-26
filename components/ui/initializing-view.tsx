import { Center, CenterProps, chakra, Heading, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

const MotionCenter = motion<CenterProps>(Center);

export default function InitializingView(): JSX.Element {
  return (
    <MotionCenter
      position="absolute"
      zIndex="overlay"
      width="100vw"
      height="100vh"
      backgroundColor="purple.500"
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.1, duration: 0.1 } }}
    >
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
    </MotionCenter>
  );
}
