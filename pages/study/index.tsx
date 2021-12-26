import PrimaryHeading from "components/shared/primary-heading";
import StudyDecksList from "components/study/study-decks-list";
import Layout from "components/ui/layout";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const StudyPage: NextPage = () => (
  <Layout>
    <PrimaryHeading>
      <FormattedMessage defaultMessage="Study" />
    </PrimaryHeading>
    <StudyDecksList />
  </Layout>
);

export default StudyPage;
