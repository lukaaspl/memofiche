import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import CustomDialog from "components/ui/custom-dialog";
import { PROFILE_QUERY_KEY } from "consts/query-keys";
import { Nullable } from "domains";
import { UpdateProfileRequestData } from "domains/profile";
import { DetailedProfile } from "domains/user";
import { useSuccessToast } from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import React, { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import CustomButton from "./ui/custom-button";

interface EditProfileDialogProps {
  profile: DetailedProfile;
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  website: string;
  bio: string;
}

async function updateProfile(
  requestData: UpdateProfileRequestData
): Promise<DetailedProfile> {
  const { data: updatedProfile } = await authApiClient.put<DetailedProfile>(
    "/profile",
    requestData
  );
  return updatedProfile;
}

const BIO_CHARS_LIMIT = 500;

export default function EditProfileDialog({
  profile,
  isOpen,
  onClose,
}: EditProfileDialogProps): JSX.Element {
  const initialRef = useRef<Nullable<HTMLInputElement>>(null);
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>();
  const queryClient = useQueryClient();
  const toast = useSuccessToast();

  const bioInputValue = watch("bio");

  const { ref, ...rest } = register("firstName");

  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(PROFILE_QUERY_KEY);
      toast("Profile has been updated successfully");
      onClose();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    const { firstName, lastName, website, bio } = formValues;

    updateProfileMutation.mutate({
      firstName,
      lastName,
      website,
      bio,
    });
  };

  useEffect(() => {
    if (isOpen) {
      setValue("firstName", profile.firstName || "");
      setValue("lastName", profile.lastName || "");
      setValue("bio", profile.bio || "");
      setValue("website", profile.website || "");
    }
  }, [isOpen, profile, setValue]);

  return (
    <CustomDialog
      initialFocusRef={initialRef}
      title="Edit profile"
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      render={({ Body, Footer }) => (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Body>
            <Stack direction="column" spacing={4}>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input
                  placeholder="e.g. John"
                  ref={(el) => {
                    ref(el);
                    initialRef.current = el;
                  }}
                  {...rest}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last name</FormLabel>
                <Input placeholder="e.g. Doe" {...register("lastName")} />
              </FormControl>
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  placeholder="e.g. twitter.com/johndoe_87"
                  {...register("website")}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  height="150px"
                  maxHeight="400px"
                  maxLength={BIO_CHARS_LIMIT}
                  resize="vertical"
                  placeholder="e.g. I am Doe, John Doe."
                  {...register("bio")}
                />
                <FormHelperText>
                  {BIO_CHARS_LIMIT - (bioInputValue || "").length} characters
                  left
                </FormHelperText>
              </FormControl>
            </Stack>
          </Body>
          <Footer>
            <CustomButton
              isLoading={updateProfileMutation.isLoading}
              type="submit"
              colorScheme="purple"
              mr={3}
            >
              Save
            </CustomButton>
            <CustomButton onClick={onClose}>Cancel</CustomButton>
          </Footer>
        </form>
      )}
    />
  );
}
