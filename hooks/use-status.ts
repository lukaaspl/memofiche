import { Dispatch, SetStateAction, useCallback, useState } from "react";

type RequestStatus = "idle" | "success" | "error" | "loading";

interface UseStatus {
  status: RequestStatus;
  isIdle: boolean;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  setStatus: Dispatch<SetStateAction<RequestStatus>>;
  setIdle: () => void;
  setSuccess: () => void;
  setError: () => void;
  setLoading: () => void;
}

export function useStatus(initialStatus: RequestStatus = "idle"): UseStatus {
  const [status, setStatus] = useState<RequestStatus>(initialStatus);

  return {
    status,
    isIdle: status === "idle",
    isSuccess: status === "success",
    isError: status === "error",
    isLoading: status === "loading",
    setStatus,
    setIdle: useCallback(() => setStatus("idle"), []),
    setSuccess: useCallback(() => setStatus("success"), []),
    setError: useCallback(() => setStatus("error"), []),
    setLoading: useCallback(() => setStatus("loading"), []),
  };
}

export default useStatus;
