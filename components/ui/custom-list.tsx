import {
  Box,
  Center,
  chakra,
  List,
  ListItem,
  ListProps,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { MdFolder } from "react-icons/md";
import { StarIcon } from "@chakra-ui/icons";

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
  const isSelectable = typeof generateLinkHref !== "undefined";

  const getListItemContent = (
    item: TItem,
    isDisabled: boolean
  ): JSX.Element => (
    <Stack direction="row">
      <Center
        position="relative"
        w="100px"
        h="100px"
        backgroundColor={isDisabled ? "gray.200" : "purple.500"}
        borderRadius="md"
      >
        {isFavorite?.(item) && (
          <StarIcon
            position="absolute"
            left={0}
            top={0}
            transform="translate(-40%, -40%)"
            fontSize="xl"
            color="yellow.500"
          />
        )}
        <FolderIcon size={30} color={isDisabled ? "blackAlpha.800" : "white"} />
      </Center>
      <Box flexGrow={1} p={2}>
        {renderItem(item)}
      </Box>
    </Stack>
  );

  return (
    <List spacing={6} {...listProps}>
      {items.map((item) => {
        const isDisabled = !!disableItem?.(item);

        return (
          <ListItem
            key={selectId(item)}
            {...(isDisabled
              ? {}
              : {
                  _hover: { backgroundColor: "purple.50" },
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
