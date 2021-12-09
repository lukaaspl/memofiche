import { Container, Fade } from "@chakra-ui/react";
import FloatingUserPanel from "components/floating-user-panel";
import InitializingView from "components/initializing-view";
import { AnimatePresence } from "framer-motion";
import useAuth from "hooks/use-auth";
import useThemeAdjuster from "hooks/use-theme-adjuster";
import React from "react";
import MenuSidebar from "./menu-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { isLogged } = useAuth();

  useThemeAdjuster();

  return (
    <AnimatePresence>
      {isLogged ? (
        <>
          <MenuSidebar />
          <FloatingUserPanel />
          <Fade in transition={{ enter: { duration: 0.15 } }}>
            <Container
              maxW="container.lg"
              mx="auto"
              position="relative"
              id="xd"
              py="16"
            >
              {children}
            </Container>
          </Fade>
        </>
      ) : (
        <InitializingView key="overlay" />
      )}
    </AnimatePresence>
  );
}
