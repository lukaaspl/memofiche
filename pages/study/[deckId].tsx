import StudyDeckItem from "components/study/study-deck-item";
import Layout from "components/ui/layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const StudyDeckPage: NextPage = () => {
  const router = useRouter();
  const deckId = Number(router.query.deckId);

  return (
    <Layout>
      <StudyDeckItem deckId={deckId} />
    </Layout>
  );
};

export default StudyDeckPage;
