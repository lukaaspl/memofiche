import DeckItem from "components/deck-item";
import Layout from "components/ui/layout";
import usePrivateRoute from "hooks/use-private-route";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const DeckPage: NextPage = () => {
  const router = useRouter();
  const deckId = Number(router.query.deckId);

  usePrivateRoute();

  return (
    <Layout>
      <DeckItem id={deckId} />
    </Layout>
  );
};

export default DeckPage;
