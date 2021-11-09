import { ButtonProps } from "@chakra-ui/react";
import MotionButton from "components/ui/motion-button";
import { OmitMotionCollidedProps } from "domains/framer-motion";
import useKeyUpEvent from "hooks/use-key-up-event";
import React, { useCallback, useState } from "react";

interface KeyAccessedButtonProps
  extends Omit<OmitMotionCollidedProps<ButtonProps>, "onClick"> {
  keyCode: string;
  animationScale?: number;
  animationTime?: number;
  onClick?: (source: "mouse" | "keyboard") => void;
}

const DEFAULT_ANIMATION_TIME = 0.15;
const DEFAULT_ANIMATION_SCALE = 1.2;

export default function KeyAccessedButton({
  keyCode,
  animationScale = DEFAULT_ANIMATION_SCALE,
  animationTime = DEFAULT_ANIMATION_TIME,
  isDisabled,
  onClick,
  ...buttonProps
}: KeyAccessedButtonProps): JSX.Element {
  const [isActive, setIsActive] = useState(false);

  const handleKeyUp = useCallback(
    (code: string) => {
      if (code === keyCode && !isDisabled) {
        setIsActive(true);

        if (onClick) {
          onClick("keyboard");
        }
      }
    },
    [isDisabled, keyCode, onClick]
  );

  useKeyUpEvent(handleKeyUp);

  return (
    <MotionButton
      {...buttonProps}
      onAnimationComplete={() => setIsActive(false)}
      onClick={onClick?.bind(null, "mouse")}
      whileTap={{ scale: animationScale }}
      animate={{ scale: isActive ? animationScale : 1 }}
      isDisabled={isDisabled}
      pointerEvents={isDisabled ? "none" : "all"}
      transition={{ type: "spring", duration: animationTime }}
    />
  );
}
