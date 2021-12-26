import { Box, Fade } from "@chakra-ui/react";
import InitializingView from "components/ui/initializing-view";
import { SIDEBAR_WIDTH } from "consts/dimensions";
import { AnimatePresence } from "framer-motion";
import useAuth from "hooks/use-auth";
import usePrivateView from "hooks/use-private-view";
import useThemeAdjuster from "hooks/use-theme-adjuster";
import React from "react";
import MenuSidebar from "./menu-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { isLogged } = useAuth();
  usePrivateView();
  useThemeAdjuster();

  return (
    <AnimatePresence>
      {isLogged ? (
        <>
          <MenuSidebar />
          <Fade in transition={{ enter: { duration: 0.15 } }}>
            <Box
              ml={{ base: 0, md: SIDEBAR_WIDTH }}
              px={{ base: "4", md: "10" }}
              overflowX="hidden"
            >
              <Box position="relative" mx="auto" maxW="container.xl" py="20">
                {children}
              </Box>
            </Box>
          </Fade>
        </>
      ) : (
        <InitializingView key="overlay" />
      )}
    </AnimatePresence>
  );
}
