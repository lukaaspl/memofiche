import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

type DisplayToastFn = (description: string) => void;

export default function useErrorToast(): DisplayToastFn {
  const toast = useToast();

  const displayToast = useCallback(
    (description: string) => {
      toast({ status: "error", description });
    },
    [toast]
  );

  return displayToast;
}
