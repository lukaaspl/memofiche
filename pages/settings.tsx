import { AnimatedSkeletonStack } from "components/ui/animated-skeleton";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";

const SettingsPage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>Settings</PrimaryHeading>
      <AnimatedSkeletonStack />
    </Layout>
  );
};

export default SettingsPage;
