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
import useCommonPalette from "hooks/use-common-palette";
import useErrorToast from "hooks/use-error-toast";
import useSuccessToast from "hooks/use-success-toast";
import useTranslation from "hooks/use-translation";
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
  const { $t } = useTranslation();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const palette = useCommonPalette();

  const resetPasswordMutation = useMutation(resetPassword, {
    onSuccess: () => {
      successToast(
        $t({ defaultMessage: "Password has been reset successfully" })
      );
      reset();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        errorToast($t({ defaultMessage: "Old password doesn't match" }));
        return;
      }

      errorToast(
        $t({ defaultMessage: "An error occurred while resetting password" })
      );
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
        color={palette.primary}
      >
        {$t({ defaultMessage: "Reset password" })}
      </PrimaryHeading>
      <Form onSubmit={onSubmit} mt={5} maxWidth="500px">
        <FormControl mt={4} isRequired>
          <FormLabel>{$t({ defaultMessage: "Current password" })}</FormLabel>
          <Input
            type="password"
            placeholder={$t({ defaultMessage: "Enter your current password" })}
            {...register("currentPassword", { required: true })}
          />
        </FormControl>
        <FormControl mt={4} isRequired>
          <FormLabel>{$t({ defaultMessage: "New password" })}</FormLabel>
          <Input
            type="password"
            placeholder={$t({ defaultMessage: "Enter the new password" })}
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
          <FormLabel>{$t({ defaultMessage: "Repeat new password" })}</FormLabel>
          <Input
            type="password"
            placeholder={$t({ defaultMessage: "Enter the new password again" })}
            {...register("confirmedNewPassword", {
              required: true,
              validate: (value) => value === getValues().newPassword,
            })}
          />
          <FormErrorMessage>
            {$t({ defaultMessage: "Passwords don't match" })}
          </FormErrorMessage>
        </FormControl>
        <CustomButton
          isLoading={resetPasswordMutation.isLoading}
          loadingText={$t({ defaultMessage: "Resetting..." })}
          type="submit"
          mt={6}
          colorScheme="purple"
        >
          {$t({ defaultMessage: "Reset password" })}
        </CustomButton>
      </Form>
    </>
  );
}
