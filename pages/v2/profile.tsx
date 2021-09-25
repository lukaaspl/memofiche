import ProfileDetails from "components/profile-details";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";

const ProfilePage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>Profile</PrimaryHeading>
      <ProfileDetails />
    </Layout>
  );
};

export default ProfilePage;
