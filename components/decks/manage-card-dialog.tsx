import {
  Alert,
  AlertIcon,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Card, CardType } from "@prisma/client";
import { useLocalStorage } from "beautiful-react-hooks";
import { DECK_QUERY_KEY } from "consts/query-keys";
import { ARE_DECK_TAGS_INCLUDED } from "consts/storage-keys";
import { Nullable } from "domains";
import { DetailedCard, UpdateCardRequestData } from "domains/card";
import { DeckTag } from "domains/tags";
import useCreateCardMutation from "hooks/use-create-card-mutation";
import useSuccessToast from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import React, { EffectCallback, useCallback, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { TagsConverter } from "utils/tags";
import CustomButton from "components/ui/custom-button";
import CustomDialog from "components/ui/custom-dialog";
import Form from "components/ui/form";

type ManageCardDialogProps = {
  isOpen: boolean;
  deckTags: DeckTag[];
  onClose: () => void;
} & (
  | { deckId: number; editingCard?: never }
  | { deckId?: never; editingCard: DetailedCard }
);

interface FormValues {
  obverse: string;
  reverse: string;
  note: string;
  type: CardType;
  tags: string;
}

async function updateCard(variables: UpdateCardRequestData): Promise<Card> {
  const { id, deckId, ...body } = variables;

  const { data: updatedCard } = await authApiClient.put<Card>(
    `/decks/${deckId}/card/${id}`,
    body
  );

  return updatedCard;
}

const descriptionsByCardType = {
  [CardType.Normal]:
    "Basic, double-sided card being flipped from the obverse to the reverse while studying",
  [CardType.Reverse]:
    "Same card type as normal with the difference that there's a 50% chance to swipe the sides (from the reverse to the obverse)",
};

export default function ManageCardDialog({
  deckId,
  deckTags,
  isOpen,
  onClose,
  editingCard,
}: ManageCardDialogProps): JSX.Element {
  const initialRef = useRef<Nullable<HTMLTextAreaElement>>(null);
  const queryClient = useQueryClient();
  const toast = useSuccessToast();

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      type: CardType.Normal,
    },
  });

  const pickedCardType = watch("type");

  const [areDeckTagsIncluded, setAreDeckTagsIncluded] =
    useLocalStorage<boolean>(ARE_DECK_TAGS_INCLUDED, false);

  const createCardMutation = useCreateCardMutation({ onSuccess: onClose });

  const updateCardMutation = useMutation(updateCard, {
    onSuccess: (card) => {
      queryClient.invalidateQueries([DECK_QUERY_KEY, card.deckId]);
      toast("Card has been updated successfully");
      onClose();
    },
  });

  const isEditMode = typeof editingCard !== "undefined";

  const { ref, ...rest } = register("obverse", { required: true });

  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    const { obverse, reverse, type, note, tags } = formValues;

    const tagsArr = TagsConverter.toArray(tags);

    const joinedTags = areDeckTagsIncluded
      ? TagsConverter.joinWithTagObjects(tagsArr, deckTags)
      : tagsArr;

    if (isEditMode) {
      updateCardMutation.mutate({
        id: editingCard.id,
        deckId: editingCard.deckId,
        obverse,
        reverse,
        type,
        note,
        tags: joinedTags,
      });
    } else {
      createCardMutation.mutate({
        deckId: deckId as number,
        obverse,
        reverse,
        type,
        note,
        tags: joinedTags,
      });
    }
  };

  const fillInputFieldsEffect = useCallback<EffectCallback>(() => {
    if (!isOpen) {
      return;
    }

    if (isEditMode) {
      const { obverse, reverse, type, note, tags } = editingCard;

      reset({
        obverse,
        reverse,
        type,
        note: note || "",
        tags: TagsConverter.toString(tags),
      });
    } else {
      reset();
    }
  }, [editingCard, isEditMode, isOpen, reset]);

  useEffect(fillInputFieldsEffect, [fillInputFieldsEffect]);

  return (
    <CustomDialog
      isOpen={isOpen}
      size="4xl"
      onClose={onClose}
      initialFocusRef={initialRef}
      title={isEditMode ? "Update the card" : "Add a new card"}
      render={({ Body, Footer }) => (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Body>
            <Flex justify="space-between">
              <Stack direction="column" spacing={4} flexBasis="50%" mr={8}>
                <FormControl isRequired>
                  <FormLabel>Obverse</FormLabel>
                  <Textarea
                    height="120px"
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
                  <Textarea
                    height="120px"
                    placeholder="e.g. It’s a process in which two or more parts run simultaneously"
                    {...register("reverse", { required: true })}
                  />
                </FormControl>
              </Stack>
              <Stack direction="column" spacing={4} flexBasis="50%">
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
                  {pickedCardType && (
                    <Alert
                      mt={2}
                      p={2}
                      variant="left-accent"
                      status="info"
                      fontSize="sm"
                    >
                      <AlertIcon
                        width="17px"
                        height="17px"
                        mr={2}
                        alignSelf="flex-start"
                        position="relative"
                        top="3px"
                      />
                      {descriptionsByCardType[pickedCardType]}
                    </Alert>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Note</FormLabel>
                  <Input
                    placeholder="e.g. What is this process about?"
                    {...register("note")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <Input
                    placeholder="e.g. interview, business, technical"
                    {...register("tags")}
                  />
                  <Checkbox
                    defaultChecked
                    mt={2}
                    colorScheme="purple"
                    isChecked={areDeckTagsIncluded}
                    onChange={(event) =>
                      setAreDeckTagsIncluded(() => event.target.checked)
                    }
                  >
                    Include deck&apos;s tags
                  </Checkbox>
                  <FormHelperText>
                    Tags should be comma-separated
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Flex>
          </Body>
          <Footer>
            <CustomButton
              isLoading={
                isEditMode
                  ? updateCardMutation.isLoading
                  : createCardMutation.isLoading
              }
              type="submit"
              colorScheme="purple"
              mr={3}
            >
              {isEditMode ? "Save" : "Add"}
            </CustomButton>
            <CustomButton onClick={onClose}>Cancel</CustomButton>
          </Footer>
        </Form>
      )}
    />
  );
}
