import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import useAuth from "./use-auth";

export default function usePrivateView(): void {
  const { authState, isLogged } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState.isLoading) {
      return;
    }

    if (!isLogged) {
      router.push("/sign");
    }
  }, [authState.isLoading, isLogged, router]);
}
