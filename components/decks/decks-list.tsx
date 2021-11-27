import {
  Divider,
  Flex,
  Heading,
  HStack,
  List,
  ListItem,
} from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import CustomList from "components/ui/custom-list";
import Feedback from "components/ui/feedback";
import SortingControls from "components/ui/sorting-controls";
import SyncSpinner from "components/ui/sync-spinner";
import { DECKS_SORT } from "consts/storage-keys";
import { DeckSort } from "domains/deck";
import useDecksQuery from "hooks/use-decks-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useSortState from "hooks/use-sort-state";
import { useRouter } from "next/router";
import React from "react";
import ManageDeckDialog from "./manage-deck-dialog";

export default function DecksList(): JSX.Element {
  const router = useRouter();

  const [isNewDeckDialogOpen, onNewDeckDialogOpen, onNewDeckDialogClose] =
    useSimpleDisclosure({
      defaultIsOpen: Boolean(router.query["add-deck"]),
    });

  const { sortState, updateField, updateOrder } = useSortState<
    DeckSort["sortBy"]
  >(DECKS_SORT, { sortBy: "createdAt", order: "desc" });

  const {
    data: decks,
    isRefetching,
    error,
  } = useDecksQuery(sortState, { keepPreviousData: true });

  if (error) {
    return <Feedback type="error" />;
  }

  if (!decks) {
    return <Feedback type="loading" />;
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading display="flex" size="md" mt={5} mb={3}>
          <span>Your decks ({decks.length})</span>
          {isRefetching && <SyncSpinner />}
        </Heading>
        <HStack spacing={2}>
          <SortingControls<DeckSort["sortBy"]>
            options={[
              { label: "Name", value: "name" },
              { label: "Cards count", value: "cardsCount" },
              { label: "Favorite", value: "isFavorite" },
              { label: "Creation date", value: "createdAt" },
              { label: "Last modify", value: "updatedAt" },
            ]}
            state={sortState}
            onChangeField={updateField}
            onChangeOrder={updateOrder}
          />
          <CustomButton colorScheme="purple" onClick={onNewDeckDialogOpen}>
            New deck
          </CustomButton>
          <ManageDeckDialog
            isOpen={isNewDeckDialogOpen}
            onClose={onNewDeckDialogClose}
          />
        </HStack>
      </Flex>
      <Divider />
      {decks.length === 0 && (
        <Feedback
          type="empty-state"
          message="There was no deck found"
          actionButtonLabel="Add first"
          onAction={onNewDeckDialogOpen}
        />
      )}
      <CustomList
        mt={6}
        items={decks}
        selectId={(deck) => deck.id}
        isFavorite={(deck) => deck.isFavorite}
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
