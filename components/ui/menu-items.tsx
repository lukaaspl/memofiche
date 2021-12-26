import { IconButton, ListIcon, ListItem, Tooltip } from "@chakra-ui/react";
import NavLink from "components/shared/nav-link";
import React from "react";
import { IconType } from "react-icons";

export interface MenuItem {
  label: string;
  href: string;
  exact?: boolean;
  icon: IconType;
}

interface MenuTileProps {
  item: MenuItem;
}

export function MenuTile({ item }: MenuTileProps): JSX.Element {
  return (
    <NavLink
      href={item.href}
      exact={item.exact}
      render={(isActive) => (
        <Tooltip hasArrow label={item.label} placement="right">
          <IconButton
            aria-label={item.label}
            fontSize="20"
            colorScheme="purple"
            icon={<item.icon />}
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

export interface MenuLinkProps {
  item: MenuItem;
}

export function MenuLink({ item }: MenuLinkProps): JSX.Element {
  return (
    <NavLink
      href={item.href}
      exact={item.exact}
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
          <ListIcon as={item.icon} fontSize="2xl" mr={5} />
          {item.label}
        </ListItem>
      )}
    />
  );
}
