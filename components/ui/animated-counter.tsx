import { Box, BoxProps } from "@chakra-ui/react";
import { Nullable } from "domains";
import { animate, AnimationOptions } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface AnimatedCounterProps extends BoxProps {
  to: number;
  from?: number;
  animationOptions?: AnimationOptions<number>;
  transformFn?: (value: number) => string;
}

export default function AnimatedCounter({
  to,
  from = 0,
  animationOptions,
  transformFn,
  ...boxProps
}: AnimatedCounterProps): JSX.Element {
  const nodeRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    const controls = animate(from, to, {
      ...animationOptions,
      onUpdate: (value) => {
        const transformedValue = transformFn
          ? transformFn(value)
          : value.toString();

        node.textContent = transformedValue;
      },
    });

    return () => {
      controls.stop();
    };
  }, [animationOptions, from, to, transformFn]);

  return <Box ref={nodeRef} {...boxProps} />;
}
