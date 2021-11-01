import { Flex, HStack, Text } from "@chakra-ui/react";
import Counter from "components/study/counter";
import CustomAlertDialog from "components/ui/custom-alert-dialog";
import CustomButton from "components/ui/custom-button";
import dayjs from "dayjs";
import { useIsPresent } from "framer-motion";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import React from "react";

interface StudyingTopBarProps {
  isPaused: boolean;
  isFinished: boolean;
  isFinishDisabled: boolean;
  onResume: () => void;
  onPause: () => void;
  onFinish: () => void;
}

export default function StudyingTopBar({
  isPaused,
  isFinished,
  isFinishDisabled,
  onResume,
  onPause,
  onFinish,
}: StudyingTopBarProps): JSX.Element {
  const [isOpen, onOpen, onClose] = useSimpleDisclosure();
  const isPresent = useIsPresent();

  const handleFinishConfirm = (): void => {
    onClose();
    onFinish();
  };

  return (
    <>
      <Flex
        flexDirection="row"
        alignItems="flex-end"
        justify="space-between"
        mb={2}
      >
        <Counter
          render={(elapsedSeconds) => (
            <Text
              fontFamily="Poppins"
              fontSize="lg"
              opacity={isPaused ? 0.5 : 1}
            >
              {dayjs.duration(elapsedSeconds, "s").format("HH:mm:ss")}
            </Text>
          )}
          isPaused={isPaused}
          isFinished={isFinished}
        />
        <HStack spacing={2}>
          <CustomButton
            isDisabled={!isPresent}
            onClick={isPaused ? onResume : onPause}
            colorScheme={isPaused ? "green" : "gray"}
          >
            {isPaused ? "Resume" : "Pause"}
          </CustomButton>
          <CustomButton
            isDisabled={isFinishDisabled || !isPresent}
            colorScheme="red"
            onClick={onOpen}
          >
            Finish session
          </CustomButton>
        </HStack>
      </Flex>
      <CustomAlertDialog
        title="Finish now?"
        confirmButtonLabel="Finish now"
        content={`Are you sure you want to end the session before all cards are completed?`}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleFinishConfirm}
      />
    </>
  );
}
