import {
  ComponentWithAs,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalFooterProps,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import useScreenWidth from "hooks/use-screen-width";
import React from "react";

type ModalPropsWithoutChildren = Omit<ModalProps, "children">;

interface CustomDialogProps extends ModalPropsWithoutChildren {
  title: React.ReactNode;
  hasCloseButton?: boolean;
  render: (modalElements: {
    Body: ComponentWithAs<"div", ModalBodyProps>;
    Footer: ComponentWithAs<"footer", ModalFooterProps>;
  }) => JSX.Element;
}

export default function CustomDialog({
  title,
  hasCloseButton = true,
  render,
  ...modalProps
}: CustomDialogProps): JSX.Element {
  const { isLargerThanSM } = useScreenWidth();

  return (
    <Modal {...modalProps} size={isLargerThanSM ? modalProps.size : "full"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {hasCloseButton && <ModalCloseButton />}
        {render({ Body: ModalBody, Footer: ModalFooter })}
      </ModalContent>
    </Modal>
  );
}
