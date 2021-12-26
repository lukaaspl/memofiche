import ProfileDetails from "components/profile/profile-details";
import PrimaryHeading from "components/shared/primary-heading";
import Layout from "components/ui/layout";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const ProfilePage: NextPage = () => (
  <Layout>
    <PrimaryHeading>
      <FormattedMessage defaultMessage="Profile" />
    </PrimaryHeading>
    <ProfileDetails />
  </Layout>
);

export default ProfilePage;
