import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Deck } from "@prisma/client";
import CustomAlertDialog from "components/ui/custom-alert-dialog";
import CustomButton from "components/ui/custom-button";
import Feedback from "components/ui/feedback";
import GoBackButton from "components/ui/go-back-button";
import PrimaryHeading from "components/ui/primary-heading";
import SortingControls from "components/ui/sorting-controls";
import { DECKS_QUERY_KEY } from "consts/query-keys";
import { CARDS_SORT } from "consts/storage-keys";
import { CardSort } from "domains/card";
import useDeckQuery from "hooks/use-deck-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useSortState from "hooks/use-sort-state";
import useSuccessToast from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import { useRouter } from "next/router";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { TagsConverter } from "utils/tags";
import CardsList from "./cards-list";
import ManageCardDialog from "./manage-card-dialog";
import ManageDeckDialog from "./manage-deck-dialog";
import Span from "./ui/span";
import SyncSpinner from "./ui/sync-spinner";

async function deleteDeckById(deckId: number): Promise<Deck> {
  const { data: deletedDeck } = await authApiClient.delete<Deck>(
    `/decks/${deckId}`
  );

  return deletedDeck;
}

interface DeckItemProps {
  id: number;
}

export default function DeckItem({ id }: DeckItemProps): JSX.Element {
  const { sortState, updateField, updateOrder } = useSortState<
    CardSort["sortBy"]
  >(CARDS_SORT, { sortBy: "createdAt", order: "desc" });

  const {
    data: deck,
    isRefetching,
    error,
  } = useDeckQuery(id, sortState, { keepPreviousData: true });

  const queryClient = useQueryClient();
  const toast = useSuccessToast();
  const router = useRouter();

  const [isEditDeckDialogOpen, onEditDeckDialogOpen, onEditDeckDialogClose] =
    useSimpleDisclosure();

  const [
    isDeleteDeckConfirmationDialogOpen,
    onDeleteDeckConfirmationDialogOpen,
    onDeleteDeckConfirmationDialogClose,
  ] = useSimpleDisclosure();

  const [isNewCardDialogOpen, onNewCardDialogOpen, onNewCardDialogClose] =
    useSimpleDisclosure({
      defaultIsOpen: Boolean(router.query["add-card"]),
    });

  const deleteDeckMutation = useMutation(deleteDeckById, {
    onSuccess: () => {
      toast("Deck has been deleted successfully");
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      router.push("/decks");
    },
  });

  if (error) {
    return <Feedback type="error" />;
  }

  if (!deck) {
    return <Feedback type="loading" />;
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <PrimaryHeading display="flex" alignItems="center">
          {deck.isFavorite && (
            <StarIcon
              position="relative"
              top="-2px"
              fontSize="x-large"
              color="yellow.500"
              mr={2}
            />
          )}
          <Span>
            <Span color="purple.700">{deck.name}</Span> deck
          </Span>
        </PrimaryHeading>
        <Box>
          <IconButton
            aria-label="Edit deck"
            size="md"
            icon={<MdEdit size={20} />}
            mr={2}
            onClick={onEditDeckDialogOpen}
          />
          <ManageDeckDialog
            isOpen={isEditDeckDialogOpen}
            onClose={onEditDeckDialogClose}
            editingDeck={deck}
          />
          <IconButton
            aria-label="Delete deck"
            colorScheme="red"
            size="md"
            icon={<MdDelete size={20} />}
            onClick={onDeleteDeckConfirmationDialogOpen}
          />
          <CustomAlertDialog
            title="Delete deck?"
            content={
              <>
                {`Are you sure? You can't undo this action afterwards.`}
                {deck.cards.length > 0 && (
                  <Text fontWeight="medium">
                    Important: You are going to lose all{" "}
                    <Span color="red.500">{deck.cards.length}</Span> cards
                    contained in the deck!
                  </Text>
                )}
              </>
            }
            isOpen={isDeleteDeckConfirmationDialogOpen}
            isLoading={deleteDeckMutation.isLoading}
            onClose={onDeleteDeckConfirmationDialogClose}
            onConfirm={() => deleteDeckMutation.mutate(id)}
          />
        </Box>
      </Flex>
      <Wrap spacing={2} mt={1} mb={3}>
        {TagsConverter.extractNames(deck.tags).map((tagName, index) => (
          <WrapItem key={index}>
            <Tag size="lg" variant="subtle" colorScheme="purple">
              <TagLabel>{tagName}</TagLabel>
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <GoBackButton />
      <Flex mt={6} mb={3} justify="space-between" align="center">
        <Heading size="md">
          <span>Cards ({deck.cards.length})</span>
          {isRefetching && <SyncSpinner />}
        </Heading>
        <HStack spacing={2}>
          <SortingControls<CardSort["sortBy"]>
            options={[
              { label: "Type", value: "type" },
              { label: "Creation date", value: "createdAt" },
              { label: "Last modify", value: "updatedAt" },
            ]}
            state={sortState}
            onChangeField={updateField}
            onChangeOrder={updateOrder}
          />
          <CustomButton colorScheme="purple" onClick={onNewCardDialogOpen}>
            New card
          </CustomButton>
        </HStack>
        <ManageCardDialog
          deckId={deck.id}
          deckTags={deck.tags}
          isOpen={isNewCardDialogOpen}
          onClose={onNewCardDialogClose}
        />
      </Flex>
      <Divider />
      <CardsList
        cards={deck.cards}
        deckTags={deck.tags}
        onNewCardDialogOpen={onNewCardDialogOpen}
      />
    </>
  );
}
