import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  CloseButton,
  Fade,
} from "@chakra-ui/react";
import { Nullable } from "domains";
import useTranslation from "hooks/use-translation";
import Link from "next/link";
import React, { useState } from "react";
import CustomButton from "./custom-button";
import LoadingSpinner from "./loading-spinner";

type FeedbackProps = BoxProps &
  (
    | { type: "loading"; delay?: number }
    | {
        type: "error" | "empty-state";
        message?: React.ReactNode;
        isCloseable?: boolean;
        actionButtonLabel?: string;
        actionButtonHref?: string;
        onAction?: () => void;
      }
  );

export default function Feedback(props: FeedbackProps): Nullable<JSX.Element> {
  const [isVisible, setIsVisible] = useState(true);
  const { $t } = useTranslation();

  const handleClose = (): void => setIsVisible((s) => !s);

  if (props.type === "error" || props.type === "empty-state") {
    const {
      type,
      message,
      isCloseable,
      actionButtonLabel,
      actionButtonHref,
      onAction,
      ...boxProps
    } = props;

    const isError = type === "error";

    const shouldShowActionButton = Boolean(
      actionButtonLabel && (onAction || actionButtonHref)
    );

    const actionButton = (
      <CustomButton
        ml={3}
        size="sm"
        fontSize="small"
        colorScheme={isError ? "red" : "blue"}
        variant="outline"
        _hover={{ backgroundColor: "unset" }}
        onClick={onAction}
      >
        {actionButtonLabel}
      </CustomButton>
    );

    return (
      <Fade unmountOnExit in={isVisible}>
        <Box my={5} {...boxProps}>
          <Alert status={isError ? "error" : "info"}>
            <AlertIcon />
            {message ||
              (isError
                ? $t({
                    defaultMessage:
                      "There was an error processing your request",
                  })
                : $t({ defaultMessage: "There was no item found" }))}
            {isCloseable && (
              <CloseButton
                position="absolute"
                right="6px"
                top="50%"
                transform="translateY(-50%)"
                onClick={handleClose}
              />
            )}
            {shouldShowActionButton &&
              (actionButtonHref ? (
                <Link href={actionButtonHref || ""} passHref>
                  {actionButton}
                </Link>
              ) : (
                actionButton
              ))}
          </Alert>
        </Box>
      </Fade>
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
