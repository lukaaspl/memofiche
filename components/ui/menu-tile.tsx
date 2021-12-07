import { IconButton, Tooltip } from "@chakra-ui/react";
import NavLink from "components/ui/nav-link";
import React from "react";
import { IconType } from "react-icons";

export interface IMenuTile {
  label: string;
  href: string;
  exact?: boolean;
  icon: IconType;
}

interface MenuTileProps {
  tile: IMenuTile;
}

export default function MenuTile({ tile }: MenuTileProps): JSX.Element {
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
