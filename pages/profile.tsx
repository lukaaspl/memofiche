import ProfileDetails from "components/profile/profile-details";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const ProfilePage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>
        <FormattedMessage defaultMessage="Profile" />
      </PrimaryHeading>
      <ProfileDetails />
    </Layout>
  );
};

export default ProfilePage;
