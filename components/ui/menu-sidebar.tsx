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
  Spacer,
  VStack,
} from "@chakra-ui/react";
import FloatingUserPanel from "components/ui/floating-user-panel";
import Logo from "components/ui/logo";
import { SIDEBAR_WIDTH } from "consts/dimensions";
import useMe from "hooks/use-me";
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
import AppVersion from "./app-version";
import { MenuItem, MenuLink, MenuTile } from "./menu-items";

export default function MenuSidebar(): JSX.Element {
  const { $t } = useTranslation();
  const { isLargerThanMD } = useScreenWidth();
  const [isOpen, onOpen, onClose] = useSimpleDisclosure();
  const { isAdmin } = useMe();

  const menuItems = useMemo(() => {
    const items: Record<"features" | "account", MenuItem[]> = {
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
    };

    if (isAdmin) {
      items.features.push({
        label: $t({ defaultMessage: "Todos" }),
        icon: RiTodoLine,
        href: "/todos",
      });
    }

    return items;
  }, [$t, isAdmin]);

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
          <Logo mb={4} variant="abbr" size="2xl" />
          {menuItems.features.map((item, index) => (
            <MenuTile key={index} item={item} />
          ))}
          <Spacer />
          {menuItems.account.map((item, index) => (
            <MenuTile key={index} item={item} />
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
      <Logo variant="abbr" size="2xl" />
      <FloatingUserPanel />
      <Drawer size="xs" isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent backgroundColor="purple.500">
          <DrawerCloseButton fontSize="lg" color="white" />
          <DrawerBody px={0}>
            <Logo px={6} mt={10} mb={7} variant="full" size="2xl" />
            <List px={3}>
              {menuItems.features.map((item, index) => (
                <MenuLink key={index} item={item} />
              ))}
              <Divider my={4} />
              {menuItems.account.map((item, index) => (
                <MenuLink key={index} item={item} />
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
