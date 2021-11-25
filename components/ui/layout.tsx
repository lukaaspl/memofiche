import {
  Box,
  Container,
  Fade,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import InitializingView from "components/initializing-view";
import AnimatedSkeleton from "components/ui/animated-skeleton";
import NavLink from "components/ui/nav-link";
import { AnimatePresence } from "framer-motion";
import useAuth from "hooks/use-auth";
import useThemeAdjuster from "hooks/use-theme-adjuster";
import React from "react";
import { IconType } from "react-icons";
import {
  MdDashboard,
  MdExitToApp,
  MdPerson,
  MdSchool,
  MdSettings,
} from "react-icons/md";
import { RiStackFill, RiTodoLine } from "react-icons/ri";
import Span from "./span";

interface MenuLinkTile {
  label: string;
  href: string;
  exact?: boolean;
  icon: IconType;
}

const menuTiles: Record<"features" | "account", MenuLinkTile[]> = {
  features: [
    { label: "Dashboard", exact: true, icon: MdDashboard, href: "/" },
    { label: "Decks", icon: RiStackFill, href: "/decks" },
    { label: "Study", icon: MdSchool, href: "/study" },
    { label: "Todos", icon: RiTodoLine, href: "/todos" },
  ],
  account: [
    { label: "Profile", icon: MdPerson, href: "/profile" },
    { label: "Settings", icon: MdSettings, href: "/settings" },
    { label: "Logout", icon: MdExitToApp, href: "/logout" },
  ],
};

interface MenuTileProps {
  tile: MenuLinkTile;
}

function MenuTile({ tile }: MenuTileProps): JSX.Element {
  return (
    <NavLink
      href={tile.href}
      exact={tile.exact}
      render={(isActive) => (
        <Tooltip hasArrow label={tile.label} placement="right">
          <IconButton
            aria-label={tile.label}
            fontSize="20"
            colorScheme="purple"
            icon={<tile.icon />}
            backgroundColor={isActive ? "white" : "transparent"}
            color={isActive ? "purple.500" : "white"}
            _hover={{
              backgroundColor: isActive
                ? "white"
                : "var(--chakra-colors-purple-600)",
            }}
          />
        </Tooltip>
      )}
    />
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = "64px";

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { authState, isLogged } = useAuth();

  useThemeAdjuster();

  return (
    <AnimatePresence>
      {isLogged ? (
        <Flex key="content" h="100vh" justify="flex-start" align="flex-start">
          <VStack
            position="fixed"
            spacing="4"
            backgroundColor="purple.500"
            h="100%"
            px="3"
            py="5"
            maxWidth={SIDEBAR_WIDTH}
            zIndex="1"
          >
            <Heading
              color="white"
              fontFamily="Poppins"
              fontSize="2xl"
              mb="4"
              textAlign="center"
            >
              MF
            </Heading>
            {menuTiles.features.map((tile, index) => (
              <MenuTile key={index} tile={tile} />
            ))}
            <Spacer />
            {menuTiles.account.map((tile, index) => (
              <MenuTile key={index} tile={tile} />
            ))}
            <Text fontSize="x-small" color="white" fontFamily="Poppins">
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </Text>
          </VStack>
          <Box
            position="relative"
            w="100%"
            h="100%"
            py="16"
            pl={SIDEBAR_WIDTH}
            overflowX="hidden"
          >
            <Box position="absolute" right={3} top={3}>
              <AnimatedSkeleton isLoaded={isLogged}>
                <Text>
                  Logged as{" "}
                  <Span display="inline" fontWeight="bold" color="purple.500">
                    {authState.user?.name} ({authState.user?.email})
                  </Span>
                </Text>
              </AnimatedSkeleton>
            </Box>
            <Fade in transition={{ enter: { duration: 0.15 } }}>
              <Container maxW="container.lg" mx="auto">
                {children}
              </Container>
            </Fade>
          </Box>
        </Flex>
      ) : (
        <InitializingView key="overlay" />
      )}
    </AnimatePresence>
  );
}
