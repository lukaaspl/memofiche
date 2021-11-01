import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import useAuth from "./use-auth";

export default function usePrivateRoute(): void {
  const { userData, isLogged } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userData.isLoading) {
      return;
    }

    if (!isLogged) {
      router.push("/sign");
    }
  }, [isLogged, router, userData.isLoading]);
}
