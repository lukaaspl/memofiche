import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
} from "@chakra-ui/react";
import { Nullable } from "domains";
import React, { useRef } from "react";
import CustomButton from "./custom-button";

type AlertDialogPropsWithoutChildren = Omit<
  AlertDialogProps,
  "children" | "leastDestructiveRef"
>;

interface CustomAlertDialogProps extends AlertDialogPropsWithoutChildren {
  title: React.ReactNode;
  content: React.ReactNode;
  isLoading?: boolean;
  hasCloseButton?: boolean;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CustomAlertDialog({
  title,
  content,
  isLoading = false,
  hasCloseButton = true,
  confirmButtonLabel = "Delete",
  cancelButtonLabel = "Cancel",
  onConfirm,
  onClose,
  ...modalProps
}: CustomAlertDialogProps): JSX.Element {
  const leastDestructiveRef = useRef<Nullable<HTMLButtonElement>>(null);

  return (
    <AlertDialog
      onClose={onClose}
      leastDestructiveRef={leastDestructiveRef}
      {...modalProps}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          {hasCloseButton && <AlertDialogCloseButton />}
          <AlertDialogBody>{content}</AlertDialogBody>
          <AlertDialogFooter>
            <CustomButton ref={leastDestructiveRef} onClick={onClose}>
              {cancelButtonLabel}
            </CustomButton>
            <CustomButton
              isLoading={isLoading}
              colorScheme="red"
              onClick={onConfirm}
              ml={3}
            >
              {confirmButtonLabel}
            </CustomButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
