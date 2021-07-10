import { ACCESS_TOKEN } from "consts/storage-keys";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export default function usePrivateRoute(): void {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (!accessToken) {
      router.push("/v2/sign");
    }
  }, [router]);
}
