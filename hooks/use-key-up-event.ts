import { useEffect } from "react";

export default function useKeyUpEvent(
  handler: (code: string, event: globalThis.KeyboardEvent) => void
): void {
  useEffect(() => {
    const middlewareHandler = (event: globalThis.KeyboardEvent): void =>
      handler(event.code, event);

    window.addEventListener("keyup", middlewareHandler);

    return () => {
      window.removeEventListener("keyup", middlewareHandler);
    };
  }, [handler]);
}
