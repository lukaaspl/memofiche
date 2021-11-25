import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import CustomButton from "components/ui/custom-button";
import Form from "components/ui/form";
import PrimaryHeading from "components/ui/primary-heading";
import { ResetPasswordData } from "domains/config";
import useErrorToast from "hooks/use-error-toast";
import useSuccessToast from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
}

async function resetPassword(data: ResetPasswordData): Promise<number> {
  const { status } = await authApiClient.post<void>(
    "/auth/reset-password",
    data
  );

  return status;
}

export default function ResetPasswordForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const resetPasswordMutation = useMutation(resetPassword, {
    onSuccess: () => {
      successToast("Password has been reset successfully");
      reset();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        errorToast("Old password doesn't match");
        return;
      }

      errorToast("An error occurred while resetting password");
    },
  });

  const onSubmit = handleSubmit((data) => {
    resetPasswordMutation.mutate({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  });

  return (
    <>
      <PrimaryHeading
        mt={12}
        pb="1.5"
        borderBottom="1px solid"
        borderColor="purple.800"
        size="sm"
        color="purple.500"
      >
        Reset password
      </PrimaryHeading>
      <Form onSubmit={onSubmit} mt={5} minW="400px" w="50%">
        <FormControl mt={4} isRequired>
          <FormLabel>Current password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your current password"
            {...register("currentPassword", { required: true })}
          />
        </FormControl>
        <FormControl mt={4} isRequired>
          <FormLabel>New password</FormLabel>
          <Input
            type="password"
            placeholder="Enter the new password"
            {...register("newPassword", { required: true })}
          />
        </FormControl>
        <FormControl
          mt={4}
          isRequired
          isInvalid={
            isSubmitted && errors.confirmedNewPassword?.type === "validate"
          }
        >
          <FormLabel>Repeat new password</FormLabel>
          <Input
            type="password"
            placeholder="Enter the new password again"
            {...register("confirmedNewPassword", {
              required: true,
              validate: (value) => value === getValues().newPassword,
            })}
          />
          <FormErrorMessage>Passwords don&apos;t match</FormErrorMessage>
        </FormControl>
        <CustomButton
          isLoading={resetPasswordMutation.isLoading}
          loadingText="Resetting..."
          type="submit"
          mt={6}
          colorScheme="purple"
        >
          Reset password
        </CustomButton>
      </Form>
    </>
  );
}
