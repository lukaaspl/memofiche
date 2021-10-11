import { useDisclosure, UseDisclosureProps } from "@chakra-ui/react";

type UseSimpleDisclosure = [
  isOpen: boolean,
  onClose: () => void,
  onOpen: () => void
];

export default function useSimpleDisclosure(
  props?: UseDisclosureProps
): UseSimpleDisclosure {
  const { isOpen, onClose, onOpen } = useDisclosure(props);

  return [isOpen, onClose, onOpen];
}
