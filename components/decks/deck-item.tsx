import {
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
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
import CardsList from "./cards-list";
import DeleteDeckConfirmationDialog from "./delete-deck-confirmation-dialog";
import ItemTags from "./item-tags";
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
        <HStack spacing={2}>
          <IconButton
            aria-label={$t({ defaultMessage: "Edit deck" })}
            size="md"
            icon={<MdEdit size={20} />}
            onClick={onEditDeckDialogOpen}
          />
          <IconButton
            aria-label={$t({ defaultMessage: "Delete deck" })}
            colorScheme="red"
            size="md"
            icon={<MdDelete size={20} />}
            onClick={onDeleteDeckConfirmationDialogOpen}
          />
          <ManageDeckDialog
            isOpen={isEditDeckDialogOpen}
            onClose={onEditDeckDialogClose}
            editingDeck={deck}
          />
          <DeleteDeckConfirmationDialog
            deck={deck}
            isOpen={isDeleteDeckConfirmationDialogOpen}
            onClose={onDeleteDeckConfirmationDialogClose}
          />
        </HStack>
      </Flex>
      <ItemTags tags={deck.tags} size="lg" spacing={2} mt={1} mb={3} />
      <GoBackButton />
      <Flex
        mt={{ base: 4, md: 8 }}
        mb={3}
        direction={{ base: "column", md: "row" }}
        justify={{ base: "flex-start", md: "space-between" }}
        align={{ base: "flex-start", md: "center" }}
      >
        <Heading display="flex" size="md" mb={{ base: 3, md: 0 }}>
          <span>
            {$t(
              { defaultMessage: "Cards ({count})" },
              { count: deck.cards.length }
            )}
          </span>
          {isRefetching && <SyncSpinner />}
        </Heading>
        <Stack
          direction={{ base: "column", md: "row" }}
          align="flex-start"
          spacing={{ base: 3, md: 2 }}
        >
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
        </Stack>
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
