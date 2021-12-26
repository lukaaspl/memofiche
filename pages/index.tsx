import DashboardContent from "components/dashboard/dashboard-content";
import PrimaryHeading from "components/shared/primary-heading";
import Layout from "components/ui/layout";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const DashboardPage: NextPage = () => (
  <Layout>
    <PrimaryHeading>
      <FormattedMessage defaultMessage="Dashboard" />
    </PrimaryHeading>
    <DashboardContent />
  </Layout>
);

export default DashboardPage;
