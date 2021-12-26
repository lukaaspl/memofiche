import { Center, CenterProps, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import Logo from "./logo";

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
        <Logo variant="abbr" size="7xl" />
        <Logo variant="full" size="2xl" />
      </Stack>
    </MotionCenter>
  );
}
