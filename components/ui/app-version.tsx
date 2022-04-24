import { Text } from "@chakra-ui/react";
import React from "react";

export default function AppVersion(): JSX.Element {
  return (
    <Text fontSize="x-small" color="white" fontFamily="Poppins">
      v{process.env.APP_VERSION}
    </Text>
  );
}
