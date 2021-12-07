import { Heading, Spacer, Text, VStack } from "@chakra-ui/react";
import React from "react";
import {
  MdDashboard,
  MdExitToApp,
  MdPerson,
  MdSchool,
  MdSettings,
} from "react-icons/md";
import { RiStackFill, RiTodoLine } from "react-icons/ri";
import MenuTile, { IMenuTile } from "./menu-tile";

const SIDEBAR_WIDTH = "64px";

const menuTiles: Record<"features" | "account", IMenuTile[]> = {
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

export default function MenuSidebar(): JSX.Element {
  return (
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
  );
}
