import {
  Center,
  chakra,
  List,
  ListItem,
  ListProps,
  Stack,
} from "@chakra-ui/react";
import useCommonPalette from "hooks/use-common-palette";
import useTypedColorModeValue from "hooks/use-typed-color-mode-value";
import Link from "next/link";
import React from "react";
import { MdFolder } from "react-icons/md";
import FavoriteStar from "./favorite-star";

const FolderIcon = chakra(MdFolder);

interface CustomListProps<TItem> extends ListProps {
  items: TItem[];
  selectId: (item: TItem) => React.Key;
  renderItem: (item: TItem) => JSX.Element;
  disableItem?: (item: TItem) => boolean;
  isFavorite?: (item: TItem) => boolean;
  generateLinkHref?: (item: TItem) => string;
}

export default function CustomList<TItem>({
  items,
  selectId,
  renderItem,
  disableItem,
  isFavorite,
  generateLinkHref,
  ...listProps
}: CustomListProps<TItem>): JSX.Element {
  const palette = useCommonPalette();

  const hoverBgColor = useTypedColorModeValue("backgroundColor")(
    "purple.50",
    "gray.700"
  );

  const isSelectable = typeof generateLinkHref !== "undefined";

  const getListItemContent = (
    item: TItem,
    isDisabled: boolean
  ): JSX.Element => (
    <Stack direction="row">
      <Center
        position="relative"
        w="103px"
        h="103px"
        backgroundColor={isDisabled ? palette.disabled : "purple.500"}
        borderRadius="md"
        flexShrink={0}
      >
        {isFavorite?.(item) && (
          <FavoriteStar
            position="absolute"
            left={0}
            top={0}
            transform="translate(-40%, -40%)"
            fontSize="xl"
          />
        )}
        <FolderIcon size={30} color={isDisabled ? "blackAlpha.800" : "white"} />
      </Center>
      {renderItem(item)}
    </Stack>
  );

  return (
    <List spacing={6} {...listProps}>
      {items.map((item) => {
        const isDisabled = !!disableItem?.(item);

        return (
          <ListItem
            borderRadius="md"
            key={selectId(item)}
            {...(isDisabled
              ? {}
              : {
                  _hover: { backgroundColor: hoverBgColor },
                  cursor: isSelectable ? "pointer" : "default",
                })}
          >
            {isSelectable && !isDisabled ? (
              <Link href={generateLinkHref(item)}>
                {getListItemContent(item, isDisabled)}
              </Link>
            ) : (
              getListItemContent(item, isDisabled)
            )}
          </ListItem>
        );
      })}
    </List>
  );
}
