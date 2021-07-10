import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Tooltip,
  VStack,
  Text,
} from "@chakra-ui/react";
import AnimatedSkeleton from "components/ui/animated-skeleton";
import NavLink from "components/ui/nav-link";
import useAuth from "hooks/use-auth";
import React from "react";
import { IconType } from "react-icons";
import {
  MdDashboard,
  MdExitToApp,
  MdPerson,
  MdSchool,
  MdSettings,
} from "react-icons/md";
import { RiStackFill } from "react-icons/ri";

interface MenuLinkTile {
  label: string;
  href: string;
  exact?: boolean;
  icon: IconType;
}

const menuTiles: Record<"features" | "account", MenuLinkTile[]> = {
  features: [
    { label: "Dashboard", exact: true, icon: MdDashboard, href: "/v2" },
    { label: "Decks", icon: RiStackFill, href: "/v2/decks" },
    { label: "Study", icon: MdSchool, href: "/v2/study" },
  ],
  account: [
    { label: "Profile", icon: MdPerson, href: "/v2/profile" },
    { label: "Settings", icon: MdSettings, href: "/v2/settings" },
    { label: "Logout", icon: MdExitToApp, href: "/v2/logout" },
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

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { userData } = useAuth();
  console.log(userData);

  return (
    <Flex h="100vh" overflow="hidden" justify="flex-start" align="flex-start">
      <VStack spacing="4" backgroundColor="purple.500" h="100%" px="3" py="5">
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
      </VStack>
      <Box position="relative" w="100%" h="100%" px="10" py="16">
        <Box position="absolute" right={3} top={3}>
          <AnimatedSkeleton isLoaded={!userData.loading}>
            <Text>
              Logged as{" "}
              <Box
                as="span"
                display="inline"
                fontWeight="bold"
                color="purple.500"
              >
                {userData?.data?.name} ({userData?.data?.email})
              </Box>
            </Text>
          </AnimatedSkeleton>
        </Box>
        <Container maxW="container.lg" mx="auto">
          {children}
        </Container>
      </Box>
    </Flex>
  );
}
