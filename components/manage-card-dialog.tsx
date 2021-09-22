import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { Card, CardType } from "@prisma/client";
import { DECKS_QUERY_KEY, SPECIFIED_DECK_QUERY_KEY } from "consts/query-keys";
import { Nullable } from "domains";
import {
  DetailedCard,
  PostCardRequestData,
  UpdateCardRequestData,
} from "domains/card";
import { authApiClient } from "lib/axios";
import React, { EffectCallback, useCallback, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { TagsConverter } from "utils/tags";
import CustomDialog from "./ui/custom-dialog";

type ManageCardDialogProps = {
  isOpen: boolean;
  onClose: () => void;
} & (
  | {
      deckId: number;
      editingCard?: never;
    }
  | {
      deckId?: never;
      editingCard: DetailedCard;
    }
);

interface FormValues {
  obverse: string;
  reverse: string;
  type: CardType;
  tags: string;
}

async function createCard(requestData: PostCardRequestData): Promise<Card> {
  const { deckId, ...body } = requestData;

  const { data: createdCard } = await authApiClient.post<Card>(
    `/decks/${deckId}/card`,
    body
  );

  return createdCard;
}

async function updateCard(requestData: UpdateCardRequestData): Promise<Card> {
  const { id, ...body } = requestData;

  const { data: updatedCard } = await authApiClient.put<Card>(
    `/decks/${id}`,
    body
  );

  return updatedCard;
}

export default function ManageCardDialog({
  deckId,
  isOpen,
  onClose,
  editingCard,
}: ManageCardDialogProps): JSX.Element {
  const initialRef = useRef<Nullable<HTMLInputElement>>(null);
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
  const queryClient = useQueryClient();

  const isEditMode = typeof editingCard !== "undefined";

  const { ref, ...rest } = register("obverse", { required: true });

  const createCardMutation = useMutation(createCard, {
    onSuccess: (card) => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries(SPECIFIED_DECK_QUERY_KEY(card.deckId));
      onClose();
    },
  });

  const updateCardMutation = useMutation(updateCard, {
    onSuccess: (card) => {
      queryClient.invalidateQueries(SPECIFIED_DECK_QUERY_KEY(card.deckId));
      onClose();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    const { obverse, reverse, type, tags } = formValues;

    if (isEditMode) {
      updateCardMutation.mutate({
        id: editingCard.id,
        deckId: editingCard.deckId,
        obverse,
        reverse,
        type,
        tags: TagsConverter.toArray(tags),
      });
    } else {
      createCardMutation.mutate({
        deckId: deckId as number,
        obverse,
        reverse,
        type,
        tags: TagsConverter.toArray(tags),
      });
    }
  };

  const fillInputFieldsEffect = useCallback<EffectCallback>(() => {
    if (!isOpen) {
      return;
    }

    if (isEditMode) {
      const { obverse, reverse, type, tags } = editingCard;

      setValue("obverse", obverse);
      setValue("reverse", reverse);
      setValue("type", type);
      setValue("tags", TagsConverter.toString(tags));
    } else {
      reset();
    }
  }, [editingCard, isEditMode, isOpen, reset, setValue]);

  useEffect(fillInputFieldsEffect, [fillInputFieldsEffect]);

  return (
    <CustomDialog
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      initialFocusRef={initialRef}
      title={isEditMode ? "Update the card" : "Add a new card"}
      render={({ Body, Footer }) => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Body>
            <Stack direction="column" spacing={4}>
              <FormControl isRequired>
                <FormLabel>Obverse</FormLabel>
                <Input
                  ref={(el) => {
                    ref(el);
                    initialRef.current = el;
                  }}
                  placeholder="e.g. What is multithreaded programming?"
                  {...rest}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Reverse</FormLabel>
                <Input
                  placeholder="e.g. It’s a process in which two or more parts run simultaneously"
                  {...register("reverse", { required: true })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  placeholder="Select a card type"
                  defaultValue={CardType.Normal}
                  {...register("type", { required: true })}
                >
                  <option value={CardType.Normal}>Normal</option>
                  <option value={CardType.Reverse}>Reverse</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Tags</FormLabel>
                <Input
                  placeholder="e.g. interview, business, technical"
                  {...register("tags")}
                />
                <FormHelperText>Tags should be comma-separated</FormHelperText>
              </FormControl>
            </Stack>
          </Body>
          <Footer>
            <Button
              isLoading={
                isEditMode
                  ? updateCardMutation.isLoading
                  : createCardMutation.isLoading
              }
              type="submit"
              colorScheme="purple"
              mr={3}
            >
              {isEditMode ? "Update" : "Add"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Footer>
        </form>
      )}
    />
  );
}
