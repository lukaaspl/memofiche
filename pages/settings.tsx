import { Box } from "@chakra-ui/react";
import GeneralSettingsForm from "components/settings/general-settings-form";
import ResetPasswordForm from "components/settings/reset-password-form";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const SettingsPage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>
        <FormattedMessage defaultMessage="Settings" />
      </PrimaryHeading>
      <Box mt={8}>
        <GeneralSettingsForm />
        <ResetPasswordForm />
      </Box>
    </Layout>
  );
};

export default SettingsPage;
