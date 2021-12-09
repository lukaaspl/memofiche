import {
  ButtonProps,
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";
import CustomButton from "./custom-button";

export const TooltipButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { tooltipProps: Omit<TooltipProps, "children"> }
>((props, ref) => {
  const { tooltipProps, ...buttonProps } = props;
  return (
    <Tooltip {...tooltipProps}>
      <CustomButton ref={ref} {...buttonProps} />
    </Tooltip>
  );
});

TooltipButton.displayName = "TooltipButton";

export const TooltipIconButton = forwardRef<
  HTMLButtonElement,
  IconButtonProps & { tooltipProps: Omit<TooltipProps, "children"> }
>((props, ref) => {
  const { tooltipProps, ...buttonProps } = props;
  return (
    <Tooltip {...tooltipProps}>
      <IconButton ref={ref} {...buttonProps} />
    </Tooltip>
  );
});

TooltipIconButton.displayName = "TooltipIconButton";
