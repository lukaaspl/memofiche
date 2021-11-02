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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { CardType } from "@prisma/client";
import { Nullable } from "domains";
import { DetailedCard } from "domains/card";
import { DeckTag } from "domains/tags";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import { truncate } from "lodash";
import React, { useState } from "react";
import { BsCardText } from "react-icons/bs";
import {
  MdDelete,
  MdEdit,
  MdInfoOutline,
  MdMoreHoriz,
  MdRepeat,
} from "react-icons/md";
import CardDetailsDialog from "./card-details-dialog";
import DeleteCardConfirmationDialog from "./delete-card-confirmation-dialog";
import ManageCardDialog from "./manage-card-dialog";
import Feedback from "./ui/feedback";

interface CardsListProps {
  cards: DetailedCard[];
  deckTags: DeckTag[];
  onNewCardDialogOpen: () => void;
}

const TABLE_CELL_CHARS_LIMIT = 150;

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

  if (cards.length === 0) {
    return (
      <Feedback
        mt={3}
        type="empty-state"
        message="There was no card found"
        actionButtonLabel="Add first"
        onAction={onNewCardDialogOpen}
      />
    );
  }

  return (
    <>
      <Table mt={3} variant="simple" colorScheme="purple">
        <Thead>
          <Tr>
            {["Type", "Obverse", "Reverse", "Tags", ""].map((heading) => (
              <Th
                key={heading}
                fontSize="sm"
                fontFamily="Poppins"
                color="purple.700"
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
                  {card.tags.map((tagObj, index) => (
                    <WrapItem key={index}>
                      <Tag variant="subtle" colorScheme="purple">
                        <TagLabel>{tagObj.tag?.name}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Td>
              <Td textAlign="right">
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Actions"
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
                      Show details
                    </MenuItem>
                    <MenuItem
                      icon={<MdEdit size={18} />}
                      onClick={onEditCardDialogOpen}
                    >
                      Edit card
                    </MenuItem>
                    <MenuItem
                      color="red.500"
                      icon={<MdDelete size={18} />}
                      onClick={onDeleteCardConfirmationDialogOpen}
                    >
                      Delete card
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
