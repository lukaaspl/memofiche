import { useDisclosure, UseDisclosureProps } from "@chakra-ui/react";

type UseSimpleDisclosure = [
  isOpen: boolean,
  onClose: () => void,
  onOpen: () => void
];

export default function useSimpleDisclosure(
  props?: UseDisclosureProps
): UseSimpleDisclosure {
  const { isOpen, onOpen, onClose } = useDisclosure(props);

  return [isOpen, onOpen, onClose];
}
