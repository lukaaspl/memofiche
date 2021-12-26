import DecksList from "components/decks/decks-list";
import PrimaryHeading from "components/shared/primary-heading";
import Layout from "components/ui/layout";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const DecksPage: NextPage = () => (
  <Layout>
    <PrimaryHeading>
      <FormattedMessage defaultMessage="Decks" />
    </PrimaryHeading>
    <DecksList />
  </Layout>
);

export default DecksPage;
