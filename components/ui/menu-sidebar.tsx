import { Heading, Spacer, Text, VStack } from "@chakra-ui/react";
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

const SIDEBAR_WIDTH = "64px";

export default function MenuSidebar(): JSX.Element {
  const { $t } = useTranslation();

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
