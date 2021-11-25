import { useColorMode } from "@chakra-ui/color-mode";
import { useEffect } from "react";
import useAuth from "./use-auth";

export default function useThemeAdjuster(): void {
  const { authState } = useAuth();
  const { setColorMode } = useColorMode();

  useEffect(() => {
    if (authState.user) {
      const isDarkThemeSet = authState.user.config.darkTheme;
      setColorMode(isDarkThemeSet ? "dark" : "light");
    }
  }, [authState.user, setColorMode]);
}
