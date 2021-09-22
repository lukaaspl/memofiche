import { CardType } from ".prisma/client";
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
import React, { useState } from "react";
import { BsCardText } from "react-icons/bs";
import {
  MdDelete,
  MdEdit,
  MdInfoOutline,
  MdMoreHoriz,
  MdRepeat,
} from "react-icons/md";
import { useMutation } from "react-query";
import CardDetailsDialog from "./card-details-dialog";
import ManageCardDialog from "./manage-card-dialog";
import CustomAlertDialog from "./ui/custom-alert-dialog";

interface CardsListProps {
  cards: DetailedCard[];
}

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
                <Text>{card.obverse}</Text>
              </Td>
              <Td>
                <Text>{card.reverse}</Text>
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
                    <MenuItem color="red.500" icon={<MdDelete size={18} />}>
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
        </>
      )}
    </>
  );
}

interface DeleteCardVariables {
  deckId: number;
  cardId: number;
}

// async function deleteCard(variables: DeleteCardVariables) {}

interface DeleteCardConfirmationDialogProps {
  card: DetailedCard;
  isOpen: boolean;
  onClose: () => void;
}

function DeleteCardConfirmationDialog({
  card,
  isOpen,
  onClose,
}: DeleteCardConfirmationDialogProps): JSX.Element {
  const deleteCardMutation = useMutation();

  return (
    <CustomAlertDialog
      title="Delete card?"
      content="Are you sure?"
      isLoading={false}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={}
    />
  );
}
