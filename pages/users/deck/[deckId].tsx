import { Deck } from "@prisma/client";
import prisma from "lib/prisma";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { stringNumberSchema } from "utils/validation";

interface DeckPageProps {
  deck: Deck;
}

const DeckPage: NextPage<DeckPageProps> = ({ deck }) => {
  return (
    <div style={{ margin: 20 }}>
      <h2>
        <span style={{ color: "#777" }}>{deck.name}</span> deck
      </h2>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const conciseDecks = await prisma.deck.findMany({ select: { id: true } });

  return {
    paths: conciseDecks.map((deck) => ({
      params: { deckId: deck.id.toString() },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DeckPageProps> = async (ctx) => {
  const parsedDeckId = stringNumberSchema.safeParse(ctx.params?.deckId);

  if (!parsedDeckId.success) {
    return {
      notFound: true,
    };
  }

  const deck = await prisma.deck.findUnique({
    where: { id: parsedDeckId.data },
  });

  if (!deck) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      deck,
    },
  };
};

export default DeckPage;
