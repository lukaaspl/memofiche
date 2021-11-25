import { Checkbox, Flex, FormControl, FormHelperText } from "@chakra-ui/react";
import { Config } from "@prisma/client";
import CustomButton from "components/ui/custom-button";
import Form from "components/ui/form";
import PrimaryHeading from "components/ui/primary-heading";
import Span from "components/ui/span";
import { ManageableConfig } from "domains/config";
import useMe from "hooks/use-me";
import useSuccessToast from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";

async function updateConfigMutationFn(
  config: ManageableConfig
): Promise<Config> {
  const { data } = await authApiClient.put<Config>("/config", config);
  return data;
}

const defaultValues: ManageableConfig = {
  advancedRatingControls: false,
  darkTheme: false,
};

export default function GeneralSettingsForm(): JSX.Element {
  const toast = useSuccessToast();
  const { config, updateConfig } = useMe();

  const { handleSubmit, reset, control } = useForm<ManageableConfig>({
    defaultValues,
  });

  const updateConfigMutation = useMutation(updateConfigMutationFn, {
    onSuccess: (updatedConfig) => {
      toast("Config has been updated successfully");
      updateConfig(updatedConfig);
    },
  });

  const onSubmit = handleSubmit((formValues) => {
    updateConfigMutation.mutate(formValues);
  });

  useEffect(() => {
    reset(config);
  }, [reset, config]);

  return (
    <>
      <Flex
        justify="space-between"
        align="flex-end"
        borderBottom="1px solid"
        borderColor="purple.800"
        pb="1.5"
      >
        <PrimaryHeading size="sm" color="purple.500">
          General
        </PrimaryHeading>
        <CustomButton
          onClick={() => reset(defaultValues)}
          size="sm"
          variant="outline"
        >
          Restore default settings
        </CustomButton>
      </Flex>
      <Form onSubmit={onSubmit} mt={5}>
        <FormControl mt={4} opacity={0.7}>
          <Controller
            name="darkTheme"
            control={control}
            render={({ field }) => {
              const { value, ...fieldProps } = field;
              return (
                <Checkbox
                  colorScheme="purple"
                  isChecked={value}
                  {...fieldProps}
                >
                  Use dark theme{" "}
                  <Span fontStyle="italic">(work in progress)</Span>
                </Checkbox>
              );
            }}
          />
        </FormControl>
        <FormControl mt={4}>
          <Controller
            name="advancedRatingControls"
            control={control}
            render={({ field }) => {
              const { value, ...fieldProps } = field;
              return (
                <Checkbox
                  colorScheme="purple"
                  isChecked={value}
                  {...fieldProps}
                >
                  Use advanced rating cards controls
                </Checkbox>
              );
            }}
          />
          <FormHelperText>
            Use advanced controls to evaluate cards, which will allow for a more
            precise scheduler&apos;s work
          </FormHelperText>
        </FormControl>
        <CustomButton
          isLoading={updateConfigMutation.isLoading}
          loadingText="Saving..."
          type="submit"
          mt={6}
          colorScheme="purple"
        >
          Save changes
        </CustomButton>
      </Form>
    </>
  );
}
