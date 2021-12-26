import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import FloatingUserPanel from "components/floating-user-panel";
import Logo from "components/logo";
import { SIDEBAR_WIDTH } from "consts/dimensions";
import useScreenWidth from "hooks/use-screen-width";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useTranslation from "hooks/use-translation";
import React, { useMemo } from "react";
import {
  MdDashboard,
  MdExitToApp,
  MdPerson,
  MdSchool,
  MdSettings,
} from "react-icons/md";
import { RiStackFill, RiTodoLine } from "react-icons/ri";
import MenuTile, { IMenuTile } from "./menu-tile";
import NavLink from "./nav-link";

function AppVersion(): JSX.Element {
  return (
    <Text fontSize="x-small" color="white" fontFamily="Poppins">
      v{process.env.NEXT_PUBLIC_APP_VERSION}
    </Text>
  );
}

export interface MenuLinkProps {
  tile: IMenuTile;
}

function MenuLink({ tile }: MenuLinkProps): JSX.Element {
  return (
    <NavLink
      href={tile.href}
      exact={tile.exact}
      render={(isActive) => (
        <ListItem
          d="flex"
          py={3}
          px={3}
          alignItems="center"
          fontFamily="Poppins"
          cursor="pointer"
          userSelect="none"
          borderRadius="md"
          fontWeight={isActive ? "bold" : "none"}
          backgroundColor={isActive ? "white" : "transparent"}
          color={isActive ? "purple.500" : "white"}
        >
          <ListIcon as={tile.icon} fontSize="2xl" mr={5} />
          {tile.label}
        </ListItem>
      )}
    />
  );
}

export default function MenuSidebar(): JSX.Element {
  const { $t } = useTranslation();
  const { isLargerThanMD } = useScreenWidth();
  const [isOpen, onOpen, onClose] = useSimpleDisclosure();

  const menuTiles: Record<"features" | "account", IMenuTile[]> = useMemo(
    () => ({
      features: [
        {
          label: $t({ defaultMessage: "Dashboard" }),
          exact: true,
          icon: MdDashboard,
          href: "/",
        },
        {
          label: $t({ defaultMessage: "Decks" }),
          icon: RiStackFill,
          href: "/decks",
        },
        {
          label: $t({ defaultMessage: "Study" }),
          icon: MdSchool,
          href: "/study",
        },
        {
          label: $t({ defaultMessage: "Todos" }),
          icon: RiTodoLine,
          href: "/todos",
        },
      ],
      account: [
        {
          label: $t({ defaultMessage: "Profile" }),
          icon: MdPerson,
          href: "/profile",
        },
        {
          label: $t({ defaultMessage: "Settings" }),
          icon: MdSettings,
          href: "/settings",
        },
        {
          label: $t({ defaultMessage: "Log out" }),
          icon: MdExitToApp,
          href: "/logout",
        },
      ],
    }),
    [$t]
  );

  if (isLargerThanMD) {
    return (
      <>
        <VStack
          position="fixed"
          spacing="4"
          backgroundColor="purple.500"
          h="100%"
          px="3"
          py="5"
          maxWidth={SIDEBAR_WIDTH}
          zIndex="docked"
        >
          <Logo mb={4} />
          {menuTiles.features.map((tile, index) => (
            <MenuTile key={index} tile={tile} />
          ))}
          <Spacer />
          {menuTiles.account.map((tile, index) => (
            <MenuTile key={index} tile={tile} />
          ))}
          <AppVersion />
        </VStack>
        <FloatingUserPanel position="fixed" right={3} top={4} />
      </>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      position="fixed"
      left={0}
      top={0}
      pl={2}
      pr={4}
      height={12}
      zIndex="docked"
      w="100%"
      backgroundColor="purple.500"
    >
      <IconButton
        variant="ghost"
        colorScheme="purple"
        color="white"
        aria-label="Toggle menu"
        icon={<HamburgerIcon fontSize="2xl" />}
        onClick={onOpen}
      />
      <Logo />
      <FloatingUserPanel />
      <Drawer size="xs" isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent backgroundColor="purple.500">
          <DrawerCloseButton fontSize="lg" color="white" />
          <DrawerBody px={0}>
            <List my={10} px={3}>
              {menuTiles.features.map((menuTile, index) => (
                <MenuLink key={index} tile={menuTile} />
              ))}
              <Divider my={4} />
              {menuTiles.account.map((menuTile, index) => (
                <MenuLink key={index} tile={menuTile} />
              ))}
            </List>
          </DrawerBody>
          <DrawerFooter justifyContent="center">
            <AppVersion />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
