import {
  IconButton,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { Nullable } from "domains";
import { DetailedCard } from "domains/card";
import { DeckTag } from "domains/tags";
import useCommonPalette from "hooks/use-common-palette";
import useCreateCardMutation from "hooks/use-create-card-mutation";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import useTranslation from "hooks/use-translation";
import React, { useState } from "react";
import {
  MdContentCopy,
  MdDelete,
  MdEdit,
  MdInfoOutline,
  MdMoreHoriz,
} from "react-icons/md";
import { TagsConverter } from "utils/tags";
import CardDetailsDialog from "./card-details-dialog";
import DeleteCardConfirmationDialog from "./delete-card-confirmation-dialog";
import ManageCardDialog from "./manage-card-dialog";

interface CardMenuProps extends MenuButtonProps {
  card: DetailedCard;
  deckTags: DeckTag[];
}

const CLONE_CARD_TOAST_ID = "cloneCardToast";

export default function CardMenu({
  card,
  deckTags,
  ...menuButtonProps
}: CardMenuProps): JSX.Element {
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

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label={$t({ defaultMessage: "Actions" })}
          icon={<MdMoreHoriz size={22} />}
          colorScheme="purple"
          variant="ghost"
          onClick={() => setBufferedCard(card)}
          {...menuButtonProps}
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
          <MenuItem icon={<MdEdit size={18} />} onClick={onEditCardDialogOpen}>
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
