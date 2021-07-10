import { AnimatedSkeletonStack } from "components/ui/animated-skeleton";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";

const StudyPage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>Study</PrimaryHeading>
      <AnimatedSkeletonStack />
    </Layout>
  );
};

export default StudyPage;
