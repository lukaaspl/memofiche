import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

type DisplayToastFn = (description: string) => void;

export default function useSuccessToast(): DisplayToastFn {
  const toast = useToast();

  const displayToast = useCallback(
    (description: string) => {
      toast({ status: "success", description });
    },
    [toast]
  );

  return displayToast;
}
