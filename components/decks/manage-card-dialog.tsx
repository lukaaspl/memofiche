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
import CustomButton from "components/shared/custom-button";
import CustomDialog from "components/shared/custom-dialog";
import Form from "components/shared/form";
import { cardTypeDetails, cardTypeDetailsByType } from "consts/card-types";
import { DECK_QUERY_KEY } from "consts/query-keys";
import { ARE_DECK_TAGS_INCLUDED } from "consts/storage-keys";
import { Nullable } from "domains";
import { DetailedCard, UpdateCardRequestData } from "domains/card";
import { DeckTag } from "domains/tags";
import useCreateCardMutation from "hooks/use-create-card-mutation";
import useSuccessToast from "hooks/use-success-toast";
import useTranslation from "hooks/use-translation";
import { authApiClient } from "lib/axios";
import React, { EffectCallback, useCallback, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { TagsConverter } from "utils/tags";

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

export default function ManageCardDialog({
  deckId,
  deckTags,
  isOpen,
  onClose,
  editingCard,
}: ManageCardDialogProps): JSX.Element {
  const initialRef = useRef<Nullable<HTMLTextAreaElement>>(null);
  const queryClient = useQueryClient();
  const { $t } = useTranslation();
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
      toast($t({ defaultMessage: "Card has been updated successfully" }));
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
      title={
        isEditMode
          ? $t({ defaultMessage: "Update the card" })
          : $t({ defaultMessage: "Add a new card" })
      }
      render={({ Body, Footer }) => (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Body>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify={{ base: "flex-start", md: "space-between" }}
            >
              <Stack
                direction="column"
                spacing={4}
                flexBasis="50%"
                mr={{ base: 0, md: 8 }}
                mb={{ base: 4, md: 0 }}
              >
                <FormControl isRequired>
                  <FormLabel>{$t({ defaultMessage: "Obverse" })}</FormLabel>
                  <Textarea
                    height="145px"
                    ref={(el) => {
                      ref(el);
                      initialRef.current = el;
                    }}
                    placeholder={$t({
                      defaultMessage: "e.g. What is multithreaded programming?",
                    })}
                    {...rest}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>{$t({ defaultMessage: "Reverse" })}</FormLabel>
                  <Textarea
                    height="145px"
                    placeholder={$t({
                      defaultMessage:
                        "e.g. It's a process in which two or more parts run simultaneously",
                    })}
                    {...register("reverse", { required: true })}
                  />
                </FormControl>
              </Stack>
              <Stack direction="column" spacing={4} flexBasis="50%">
                <FormControl isRequired>
                  <FormLabel>{$t({ defaultMessage: "Type" })}</FormLabel>
                  <Select
                    placeholder={$t({ defaultMessage: "Select a card type" })}
                    defaultValue={CardType.Normal}
                    {...register("type", { required: true })}
                  >
                    {cardTypeDetails.map((details) => (
                      <option key={details.type} value={details.type}>
                        {$t(details.titleDescriptor)}
                      </option>
                    ))}
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
                      {$t(cardTypeDetailsByType[pickedCardType].descDescriptor)}
                    </Alert>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>{$t({ defaultMessage: "Note" })}</FormLabel>
                  <Input
                    placeholder={$t({
                      defaultMessage: "e.g. What is this process about?",
                    })}
                    {...register("note")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{$t({ defaultMessage: "Tags" })}</FormLabel>
                  <Input
                    placeholder={$t({
                      defaultMessage: "e.g. interview, business, technical",
                    })}
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
                    {$t({ defaultMessage: "Include deck's tags" })}
                  </Checkbox>
                  <FormHelperText>
                    {$t({ defaultMessage: "Tags should be comma-separated" })}
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
              {isEditMode
                ? $t({ defaultMessage: "Save" })
                : $t({ defaultMessage: "Add" })}
            </CustomButton>
            <CustomButton onClick={onClose}>
              {$t({ defaultMessage: "Cancel" })}
            </CustomButton>
          </Footer>
        </Form>
      )}
    />
  );
}
