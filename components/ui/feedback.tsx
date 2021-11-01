import { Alert, AlertIcon, Box, BoxProps } from "@chakra-ui/react";
import React from "react";
import LoadingSpinner from "./loading-spinner";

type FeedbackProps = BoxProps &
  ({ type: "loading"; delay?: number } | { type: "error"; message?: string });

export default function Feedback(props: FeedbackProps): JSX.Element {
  if (props.type === "error") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, message, ...boxProps } = props;

    return (
      <Box my={5} {...boxProps}>
        <Alert status="error">
          <AlertIcon />
          {message || "There was an error processing your request"}
        </Alert>
      </Box>
    );
  }

  if (props.type === "loading") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, delay, ...boxProps } = props;

    return (
      <Box my={5} textAlign="center" {...boxProps}>
        <LoadingSpinner delay={delay} />
      </Box>
    );
  }

  throw new Error("Invalid feedback type");
}
