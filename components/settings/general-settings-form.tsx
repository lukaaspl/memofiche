import { Checkbox, Flex, FormControl, FormHelperText } from "@chakra-ui/react";
import { Config } from "@prisma/client";
import CustomButton from "components/shared/custom-button";
import Form from "components/shared/form";
import PrimaryHeading from "components/shared/primary-heading";
import { ManageableConfig } from "domains/config";
import useCommonPalette from "hooks/use-common-palette";
import useMe from "hooks/use-me";
import useSuccessToast from "hooks/use-success-toast";
import useTranslation from "hooks/use-translation";
import { authApiClient } from "lib/axios";
import { isEqual } from "lodash";
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
  const { config, updateConfig } = useMe();
  const { $t } = useTranslation();
  const toast = useSuccessToast();
  const palette = useCommonPalette();

  const { handleSubmit, reset, control, watch } = useForm<ManageableConfig>({
    defaultValues,
  });

  const updateConfigMutation = useMutation(updateConfigMutationFn, {
    onSuccess: (updatedConfig) => {
      toast($t({ defaultMessage: "Config has been updated successfully" }));
      updateConfig(updatedConfig);
    },
  });

  const isSubmittingDisabled = isEqual(config, watch());

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
        <PrimaryHeading size="sm" color={palette.primary}>
          {$t({ defaultMessage: "General" })}
        </PrimaryHeading>
        <CustomButton
          onClick={() => reset(defaultValues)}
          size="sm"
          variant="outline"
        >
          {$t({ defaultMessage: "Restore default settings" })}
        </CustomButton>
      </Flex>
      <Form onSubmit={onSubmit} mt={5}>
        <FormControl mt={4}>
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
                  {$t({ defaultMessage: "Use dark theme" })}
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
                  {$t({ defaultMessage: "Use advanced rating cards controls" })}
                </Checkbox>
              );
            }}
          />
          <FormHelperText>
            {$t({
              defaultMessage:
                "Use advanced controls to evaluate cards, which will allow for a more precise scheduler's work",
            })}
          </FormHelperText>
        </FormControl>
        <CustomButton
          isDisabled={isSubmittingDisabled}
          isLoading={updateConfigMutation.isLoading}
          loadingText={$t({ defaultMessage: "Saving..." })}
          type="submit"
          mt={6}
          colorScheme="purple"
        >
          {$t({ defaultMessage: "Save changes" })}
        </CustomButton>
      </Form>
    </>
  );
}
