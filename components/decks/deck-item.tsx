import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import FavoriteStar from "components/ui/favorite-star";
import Feedback from "components/ui/feedback";
import GoBackButton from "components/ui/go-back-button";
import PrimaryHeading from "components/ui/primary-heading";
import SortingControls from "components/ui/sorting-controls";
import Span from "components/ui/span";
import SyncSpinner from "components/ui/sync-spinner";
import { CARDS_SORT } from "consts/storage-keys";
import { CardSort } from "domains/card";
import useCommonPalette from "hooks/use-common-palette";
import useDeckQuery from "hooks/use-deck-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useSortState from "hooks/use-sort-state";
import useTranslation from "hooks/use-translation";
import { useRouter } from "next/router";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { TagsConverter } from "utils/tags";
import CardsList from "./cards-list";
import DeleteDeckConfirmationDialog from "./delete-deck-confirmation-dialog";
import ManageCardDialog from "./manage-card-dialog";
import ManageDeckDialog from "./manage-deck-dialog";

interface DeckItemProps {
  id: number;
}

export default function DeckItem({ id }: DeckItemProps): JSX.Element {
  const router = useRouter();
  const { $t } = useTranslation();

  const { sortState, updateField, updateOrder } = useSortState<
    CardSort["sortBy"]
  >(CARDS_SORT, { sortBy: "createdAt", order: "desc" });

  const {
    data: deck,
    isRefetching,
    error,
  } = useDeckQuery(id, sortState, { keepPreviousData: true });

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

  const palette = useCommonPalette();

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
            <FavoriteStar
              position="relative"
              top="-2px"
              fontSize="x-large"
              mr={2}
            />
          )}
          <Span>
            {$t(
              { defaultMessage: "{deckName} deck" },
              { deckName: <Span color={palette.primaryDark}>{deck.name}</Span> }
            )}
          </Span>
        </PrimaryHeading>
        <Box>
          <IconButton
            aria-label={$t({ defaultMessage: "Edit deck" })}
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
            aria-label={$t({ defaultMessage: "Delete deck" })}
            colorScheme="red"
            size="md"
            icon={<MdDelete size={20} />}
            onClick={onDeleteDeckConfirmationDialogOpen}
          />
          <DeleteDeckConfirmationDialog
            deck={deck}
            isOpen={isDeleteDeckConfirmationDialogOpen}
            onClose={onDeleteDeckConfirmationDialogClose}
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
          <span>
            {$t(
              { defaultMessage: "Cards ({count})" },
              { count: deck.cards.length }
            )}
          </span>
          {isRefetching && <SyncSpinner />}
        </Heading>
        <HStack spacing={2}>
          <SortingControls<CardSort["sortBy"]>
            options={[
              {
                label: $t({ defaultMessage: "Type" }),
                value: "type",
              },
              {
                label: $t({ defaultMessage: "Creation date" }),
                value: "createdAt",
              },
              {
                label: $t({ defaultMessage: "Last modify" }),
                value: "updatedAt",
              },
            ]}
            state={sortState}
            onChangeField={updateField}
            onChangeOrder={updateOrder}
          />
          <CustomButton colorScheme="purple" onClick={onNewCardDialogOpen}>
            {$t({ defaultMessage: "New card" })}
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
