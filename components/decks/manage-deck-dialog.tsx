import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Deck } from "@prisma/client";
import CustomButton from "components/ui/custom-button";
import CustomDialog from "components/ui/custom-dialog";
import Form from "components/ui/form";
import { DECKS_QUERY_KEY, DECK_QUERY_KEY } from "consts/query-keys";
import { Nullable } from "domains";
import {
  DetailedDeck,
  PostDeckRequestData,
  UpdateDeckRequestData,
} from "domains/deck";
import useSuccessToast from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import React, { EffectCallback, useCallback, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { TagsConverter } from "utils/tags";

interface ManageDeckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingDeck?: DetailedDeck;
}

interface FormValues {
  name: string;
  tags: string;
  isFavorite: boolean;
}

async function createDeck(requestData: PostDeckRequestData): Promise<Deck> {
  const { data: createdDeck } = await authApiClient.post<Deck>(
    `/decks`,
    requestData
  );

  return createdDeck;
}

async function updateDeck(requestData: UpdateDeckRequestData): Promise<Deck> {
  const { id, ...body } = requestData;

  const { data: updatedDeck } = await authApiClient.put<Deck>(
    `/decks/${id}`,
    body
  );

  return updatedDeck;
}

export default function ManageDeckDialog({
  isOpen,
  onClose,
  editingDeck,
}: ManageDeckDialogProps): JSX.Element {
  const initialRef = useRef<Nullable<HTMLInputElement>>(null);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const queryClient = useQueryClient();
  const toast = useSuccessToast();

  const isEditMode = typeof editingDeck !== "undefined";

  const { ref, ...rest } = register("name", { required: true });

  const createDeckMutation = useMutation(createDeck, {
    onSuccess: () => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      toast("Deck has been created successfully");
      onClose();
    },
  });

  const updateDeckMutation = useMutation(updateDeck, {
    onSuccess: (deck) => {
      queryClient.invalidateQueries([DECK_QUERY_KEY, deck.id]);
      toast("Deck has been updated successfully");
      onClose();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    const { name, tags, isFavorite } = formValues;
    const normalizedName = name.trim();

    if (isEditMode) {
      updateDeckMutation.mutate({
        id: editingDeck.id,
        name: normalizedName,
        tags: TagsConverter.toArray(tags),
        isFavorite,
      });
    } else {
      createDeckMutation.mutate({
        name: normalizedName,
        tags: TagsConverter.toArray(tags),
        isFavorite,
      });
    }
  };

  const fillInputFieldsEffect = useCallback<EffectCallback>(() => {
    if (!isOpen) {
      return;
    }

    if (isEditMode) {
      reset({
        name: editingDeck.name,
        tags: TagsConverter.toString(editingDeck.tags),
        isFavorite: editingDeck.isFavorite,
      });
    } else {
      reset();
    }
  }, [editingDeck, isEditMode, isOpen, reset]);

  useEffect(fillInputFieldsEffect, [fillInputFieldsEffect]);

  return (
    <CustomDialog
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      initialFocusRef={initialRef}
      title={isEditMode ? "Update the deck" : "Add a new deck"}
      render={({ Body, Footer }) => (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Body>
            <FormControl isRequired>
              <FormLabel>Deck name</FormLabel>
              <Input
                ref={(el) => {
                  ref(el);
                  initialRef.current = el;
                }}
                placeholder="e.g. Google interview questions"
                {...rest}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                placeholder="e.g. interview, business, technical"
                {...register("tags")}
              />
              <FormHelperText>Tags should be comma-separated</FormHelperText>
            </FormControl>
            <FormControl mt={4}>
              <Checkbox colorScheme="purple" {...register("isFavorite")}>
                Mark as favorite deck
              </Checkbox>
            </FormControl>
          </Body>
          <Footer>
            <CustomButton
              isLoading={
                isEditMode
                  ? updateDeckMutation.isLoading
                  : createDeckMutation.isLoading
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