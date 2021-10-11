import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import useDecksQuery from "hooks/use-decks-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import React from "react";
import ManageDeckDialog from "./manage-deck-dialog";
import CustomList from "./ui/custom-list";

export default function DecksList(): JSX.Element {
  const [isOpen, onClose, onOpen] = useSimpleDisclosure();
  const { data: decks, isLoading, error } = useDecksQuery();

  if (error) {
    return (
      <Box my={5} textAlign="center">
        <Text>An error occurred</Text>
      </Box>
    );
  }

  if (!decks || isLoading) {
    return (
      <Box my={5} textAlign="center">
        <CircularProgress isIndeterminate color="purple.500" />
      </Box>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading size="md" mt={5} mb={2}>
          Private decks ({decks.length})
        </Heading>
        <Button colorScheme="purple" variant="solid" onClick={onOpen}>
          New deck
        </Button>
        <ManageDeckDialog isOpen={isOpen} onClose={onClose} />
      </Flex>
      <Divider />
      <CustomList
        mt={5}
        items={decks}
        selectId={(deck) => deck.id}
        renderItem={(deck) => (
          <>
            <Heading size="sm" color="purple.900">
              {deck.name}
            </Heading>
            <List my={1}>
              <ListItem fontSize="smaller">
                Created: {new Date(deck.createdAt).toLocaleString()}
              </ListItem>
              <ListItem fontSize="smaller">
                Last modified: {new Date(deck.updatedAt).toLocaleString()}
              </ListItem>
              <ListItem fontSize="smaller">
                Cards: <b>{deck.cards.length}</b>
              </ListItem>
            </List>
          </>
        )}
        generateLinkHref={(deck) => `/v2/decks/${deck.id}`}
      />
    </>
  );
}
