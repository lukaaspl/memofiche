import Deck from "components/decks/deck";
import Layout from "components/ui/layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const DeckPage: NextPage = () => {
  const router = useRouter();
  const deckId = Number(router.query.deckId);

  return (
    <Layout>
      <Deck id={deckId} />
    </Layout>
  );
};

export default DeckPage;
