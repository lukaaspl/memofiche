import { CardType, Card } from "@prisma/client";
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
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Nullable } from "domains";
import { DetailedCard } from "domains/card";
import { authApiClient } from "lib/axios";
import React, { useState } from "react";
import { BsCardText } from "react-icons/bs";
import {
  MdDelete,
  MdEdit,
  MdInfoOutline,
  MdMoreHoriz,
  MdRepeat,
} from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import CardDetailsDialog from "./card-details-dialog";
import ManageCardDialog from "./manage-card-dialog";
import CustomAlertDialog from "./ui/custom-alert-dialog";
import { DECKS_QUERY_KEY, SPECIFIED_DECK_QUERY_KEY } from "consts/query-keys";
import DeleteCardConfirmationDialog from "./delete-card-confirmation-dialog";
import { truncate } from "lodash";

interface CardsListProps {
  cards: DetailedCard[];
}

const TABLE_CELL_CHARS_LIMIT = 150;

export default function CardsList({ cards }: CardsListProps): JSX.Element {
  const [bufferedCard, setBufferedCard] =
    useState<Nullable<DetailedCard>>(null);

  const {
    isOpen: isCardDetailsDialogOpen,
    onOpen: onCardDetailsDialogOpen,
    onClose: onCardDetailsDialogClose,
  } = useDisclosure();

  const {
    isOpen: isEditCardDialogOpen,
    onOpen: onEditCardDialogOpen,
    onClose: onEditCardDialogClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteCardConfirmationDialogOpen,
    onOpen: onDeleteCardConfirmationDialogOpen,
    onClose: onDeleteCardConfirmationDialogClose,
  } = useDisclosure();

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
