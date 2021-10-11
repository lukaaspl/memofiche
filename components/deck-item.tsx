import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Flex,
  Heading,
  IconButton,
  Tag,
  TagLabel,
  Text,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Deck } from "@prisma/client";
import PrimaryHeading from "components/ui/primary-heading";
import { DECKS_QUERY_KEY } from "consts/query-keys";
import useDeckQuery from "hooks/use-deck-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import { authApiClient } from "lib/axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import CardsList from "./cards-list";
import ManageCardDialog from "./manage-card-dialog";
import ManageDeckDialog from "./manage-deck-dialog";
import CustomAlertDialog from "./ui/custom-alert-dialog";

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
  const { data: deck, isLoading, error } = useDeckQuery(id);
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const [isEditDeckDialogOpen, onEditDeckDialogClose, onEditDeckDialogOpen] =
    useSimpleDisclosure();

  const [
    isDeleteDeckConfirmationDialogOpen,
    onDeleteDeckConfirmationDialogClose,
    onDeleteDeckConfirmationDialogOpen,
  ] = useSimpleDisclosure();

  const [isNewCardDialogOpen, onNewCardDialogClose, onNewCardDialogOpen] =
    useSimpleDisclosure({
      defaultIsOpen: Boolean(router.query["add-card"]),
    });

  const deleteDeckMutation = useMutation(deleteDeckById, {
    onSuccess: () => {
      toast({
        status: "success",
        description: "Deck has been deleted successfully",
      });

      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      router.push("/v2/decks");
    },
  });

  if (error) {
    return (
      <Box my={5} textAlign="center">
        <Text>An error occurred</Text>
      </Box>
    );
  }

  if (!deck || isLoading) {
    return (
      <Box my={5} textAlign="center">
        <CircularProgress isIndeterminate color="purple.500" />
      </Box>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <PrimaryHeading>
          <Text as="span" color="purple.700">
            {deck.name}
          </Text>{" "}
          deck
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
                    <Text as="span" color="red.500">
                      {deck.cards.length}
                    </Text>{" "}
                    cards contained in the deck!
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
        {deck.tags.map((tagObj, index) => (
          <WrapItem key={index}>
            <Tag size="lg" variant="subtle" colorScheme="purple">
              <TagLabel>{tagObj.tag?.name}</TagLabel>
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <Link href="/v2/decks" passHref>
        <Button variant="link">&laquo; Back to decks</Button>
      </Link>
      <Flex mt={6} mb={2} justify="space-between" align="center">
        <Heading size="md">Cards ({deck.cards.length})</Heading>
        <Button
          fontFamily="Poppins"
          colorScheme="purple"
          variant="solid"
          onClick={onNewCardDialogOpen}
        >
          New card
        </Button>
        <ManageCardDialog
          deckId={deck.id}
          isOpen={isNewCardDialogOpen}
          onClose={onNewCardDialogClose}
        />
      </Flex>
      <Divider />
      <CardsList cards={deck.cards} />
    </>
  );
}
