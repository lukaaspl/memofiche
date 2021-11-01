import { useInterval } from "beautiful-react-hooks";
import React, { useEffect, useState } from "react";

interface CounterProps {
  isPaused?: boolean;
  isFinished?: boolean;
  render: (elapsedTime: number) => JSX.Element;
}

export default function Counter({
  isPaused = false,
  isFinished = false,
  render,
}: CounterProps): JSX.Element {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [, clearInterval] = useInterval(() => {
    if (!isPaused) {
      setElapsedSeconds((prevSeconds) => prevSeconds + 1);
    }
  }, 1000);

  useEffect(() => {
    if (isFinished) {
      clearInterval();
    }
  }, [clearInterval, isFinished]);

  return <>{render(elapsedSeconds)}</>;
}
