import StudyDecksList from "components/study/study-decks-list";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const StudyPage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>
        <FormattedMessage defaultMessage="Study" />
      </PrimaryHeading>
      <StudyDecksList />
    </Layout>
  );
};

export default StudyPage;
