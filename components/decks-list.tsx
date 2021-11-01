import { Divider, Flex, Heading, List, ListItem } from "@chakra-ui/react";
import CustomList from "components/ui/custom-list";
import Feedback from "components/ui/feedback";
import useDecksQuery from "hooks/use-decks-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import React from "react";
import ManageDeckDialog from "./manage-deck-dialog";
import CustomButton from "./ui/custom-button";

export default function DecksList(): JSX.Element {
  const [isOpen, onOpen, onClose] = useSimpleDisclosure();
  const { data: decks, isLoading, error } = useDecksQuery();

  if (error) {
    return <Feedback type="error" />;
  }

  if (!decks || isLoading) {
    return <Feedback type="loading" />;
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading size="md" mt={5} mb={2}>
          Private decks ({decks.length})
        </Heading>
        <CustomButton colorScheme="purple" onClick={onOpen}>
          New deck
        </CustomButton>
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
        generateLinkHref={(deck) => `/decks/${deck.id}`}
      />
    </>
  );
}
