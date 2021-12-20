import DecksList from "components/decks/decks-list";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import React from "react";
import { FormattedMessage } from "react-intl";

const DecksPage: NextPage = () => {
  // TODO: move hook to layout component (rename to sth more descriptive, e.g. UserPanelLayout)
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>
        <FormattedMessage defaultMessage="Decks" />
      </PrimaryHeading>
      <DecksList />
    </Layout>
  );
};

export default DecksPage;
