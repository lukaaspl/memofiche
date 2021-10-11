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

const FolderIcon = chakra(MdFolder);

interface CustomListProps<TItem> extends ListProps {
  items: TItem[];
  selectId: (item: TItem) => React.Key;
  renderItem: (item: TItem) => JSX.Element;
  disableItem?: (item: TItem) => boolean;
  generateLinkHref?: (item: TItem) => string;
}

export default function CustomList<TItem>({
  items,
  selectId,
  renderItem,
  disableItem,
  generateLinkHref,
  ...listProps
}: CustomListProps<TItem>): JSX.Element {
  const getListItemContent = (
    item: TItem,
    isDisabled: boolean
  ): JSX.Element => (
    <Stack direction="row">
      <Center
        w="100px"
        h="100px"
        backgroundColor={isDisabled ? "gray.200" : "purple.500"}
        borderRadius="md"
      >
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
                  cursor: "pointer",
                })}
          >
            {generateLinkHref && !isDisabled ? (
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
