import DashboardContent from "components/dashboard/dashboard-content";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const DashboardPage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>
        <FormattedMessage defaultMessage="Dashboard" />
      </PrimaryHeading>
      <DashboardContent />
    </Layout>
  );
};

export default DashboardPage;
