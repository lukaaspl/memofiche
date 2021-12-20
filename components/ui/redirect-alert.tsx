import { Alert, AlertIcon, AlertTitle, Center } from "@chakra-ui/react";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function RedirectAlert(): JSX.Element {
  return (
    <Center h="100vh">
      <Alert
        status="info"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="150px"
        rounded="md"
        maxW="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle fontSize="lg" mt={4} mb={1}>
          <FormattedMessage defaultMessage="Redirecting..." />
        </AlertTitle>
      </Alert>
    </Center>
  );
}
