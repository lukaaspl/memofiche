import { Box } from "@chakra-ui/react";
import GeneralSettingsForm from "components/settings/general-settings-form";
import ResetPasswordForm from "components/settings/reset-password-form";
import PrimaryHeading from "components/shared/primary-heading";
import Layout from "components/ui/layout";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const SettingsPage: NextPage = () => (
  <Layout>
    <PrimaryHeading>
      <FormattedMessage defaultMessage="Settings" />
    </PrimaryHeading>
    <Box mt={{ base: 4, md: 8 }}>
      <GeneralSettingsForm />
      <ResetPasswordForm />
    </Box>
  </Layout>
);

export default SettingsPage;
