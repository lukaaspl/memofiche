import { Button, ButtonProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function GoBackButton(buttonProps: ButtonProps): JSX.Element {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="link" {...buttonProps}>
      &laquo; <FormattedMessage defaultMessage="Go back" />
    </Button>
  );
}
