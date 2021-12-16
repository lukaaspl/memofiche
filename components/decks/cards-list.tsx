import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { CardType } from "@prisma/client";
import Feedback from "components/ui/feedback";
import { Nullable } from "domains";
import { DetailedCard } from "domains/card";
import { DeckTag } from "domains/tags";
import useCommonPalette from "hooks/use-common-palette";
import useCreateCardMutation from "hooks/use-create-card-mutation";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useTranslation from "hooks/use-translation";
import { truncate } from "lodash";
import React, { useMemo, useState } from "react";
import { BsCardText } from "react-icons/bs";
import {
  MdContentCopy,
  MdDelete,
  MdEdit,
  MdInfoOutline,
  MdMoreHoriz,
  MdRepeat,
} from "react-icons/md";
import { TagsConverter } from "utils/tags";
import CardDetailsDialog from "./card-details-dialog";
import DeleteCardConfirmationDialog from "./delete-card-confirmation-dialog";
import ManageCardDialog from "./manage-card-dialog";

interface CardsListProps {
  cards: DetailedCard[];
  deckTags: DeckTag[];
  onNewCardDialogOpen: () => void;
}

const TABLE_CELL_CHARS_LIMIT = 150;
const CLONE_CARD_TOAST_ID = "cloneCardToast";

export default function CardsList({
  cards,
  deckTags,
  onNewCardDialogOpen,
}: CardsListProps): JSX.Element {
  const [bufferedCard, setBufferedCard] =
    useState<Nullable<DetailedCard>>(null);

  const [
    isCardDetailsDialogOpen,
    onCardDetailsDialogOpen,
    onCardDetailsDialogClose,
  ] = useSimpleDisclosure();

  const [isEditCardDialogOpen, onEditCardDialogOpen, onEditCardDialogClose] =
    useSimpleDisclosure();

  const [
    isDeleteCardConfirmationDialogOpen,
    onDeleteCardConfirmationDialogOpen,
    onDeleteCardConfirmationDialogClose,
  ] = useSimpleDisclosure();

  const { $t } = useTranslation();
  const toast = useToast();
  const palette = useCommonPalette();

  const cloneCardMutation = useCreateCardMutation({
    onMutate: () => {
      toast({
        description: $t({ defaultMessage: "Cloning the card..." }),
        duration: null,
        id: CLONE_CARD_TOAST_ID,
        isClosable: false,
        status: "info",
      });
    },
    onSuccess: () => {
      toast.close(CLONE_CARD_TOAST_ID);
    },
    onError: () => {
      toast.update(CLONE_CARD_TOAST_ID, {
        description: $t({ defaultMessage: "Cloning card failed" }),
        duration: 5000,
        isClosable: true,
        status: "error",
      });
    },
  });

  const tableHeadings = useMemo(
    () => [
      $t({ defaultMessage: "Type" }),
      $t({ defaultMessage: "Obverse" }),
      $t({ defaultMessage: "Reverse" }),
      $t({ defaultMessage: "Tags" }),
      "",
    ],
    [$t]
  );

  if (cards.length === 0) {
    return (
      <Feedback
        type="empty-state"
        message={$t({ defaultMessage: "There was no card found" })}
        actionButtonLabel={$t({
          defaultMessage: "Add first",
          description: "Add first card button",
        })}
        onAction={onNewCardDialogOpen}
      />
    );
  }

  return (
    <>
      <Table mt={5} variant="simple" colorScheme="purple">
        <Thead>
          <Tr>
            {tableHeadings.map((heading) => (
              <Th
                key={heading}
                fontSize="sm"
                fontFamily="Poppins"
                color={palette.primaryDark}
              >
                {heading}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {cards.map((card) => (
            <Tr key={card.id}>
              <Td>
                <Tag variant="solid" colorScheme="purple">
                  <TagLeftIcon
                    as={card.type === CardType.Reverse ? MdRepeat : BsCardText}
                    fontSize={19}
                  />
                  <TagLabel>{card.type}</TagLabel>
                </Tag>
              </Td>
              <Td>
                <Text>
                  {truncate(card.obverse, { length: TABLE_CELL_CHARS_LIMIT })}
                </Text>
              </Td>
              <Td>
                <Text>
                  {truncate(card.reverse, { length: TABLE_CELL_CHARS_LIMIT })}
                </Text>
              </Td>
              <Td>
                <Wrap>
                  {TagsConverter.extractNames(card.tags).map(
                    (tagName, index) => (
                      <WrapItem key={index}>
                        <Tag variant="subtle" colorScheme="purple">
                          <TagLabel>{tagName}</TagLabel>
                        </Tag>
                      </WrapItem>
                    )
                  )}
                </Wrap>
              </Td>
              <Td textAlign="right">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label={$t({ defaultMessage: "Actions" })}
                    icon={<MdMoreHoriz size={22} />}
                    colorScheme="purple"
                    variant="ghost"
                    onClick={() => setBufferedCard(card)}
                  />
                  <MenuList>
                    <MenuItem
                      icon={<MdInfoOutline size={18} />}
                      onClick={onCardDetailsDialogOpen}
                    >
                      {$t({ defaultMessage: "Show details" })}
                    </MenuItem>
                    <MenuItem
                      icon={<MdContentCopy size={18} />}
                      onClick={() =>
                        cloneCardMutation.mutate({
                          ...card,
                          tags: TagsConverter.extractNames(card.tags),
                        })
                      }
                      isDisabled={cloneCardMutation.isLoading}
                    >
                      {$t({ defaultMessage: "Clone card" })}
                    </MenuItem>
                    <MenuItem
                      icon={<MdEdit size={18} />}
                      onClick={onEditCardDialogOpen}
                    >
                      {$t({ defaultMessage: "Edit card" })}
                    </MenuItem>
                    <MenuItem
                      color={palette.red}
                      icon={<MdDelete size={18} />}
                      onClick={onDeleteCardConfirmationDialogOpen}
                    >
                      {$t({ defaultMessage: "Delete card" })}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {bufferedCard && (
        <>
          <CardDetailsDialog
            card={bufferedCard}
            isOpen={isCardDetailsDialogOpen}
            onClose={onCardDetailsDialogClose}
          />
          <ManageCardDialog
            editingCard={bufferedCard}
            deckTags={deckTags}
            isOpen={isEditCardDialogOpen}
            onClose={onEditCardDialogClose}
          />
          <DeleteCardConfirmationDialog
            card={bufferedCard}
            isOpen={isDeleteCardConfirmationDialogOpen}
            onClose={onDeleteCardConfirmationDialogClose}
          />
        </>
      )}
    </>
  );
}
