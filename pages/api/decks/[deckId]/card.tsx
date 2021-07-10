import { CardType } from "@prisma/client";
import { BadRequest, InternalServerError, NotFound } from "http-errors";
import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { getDefaultMemoDetails } from "utils/super-memo";
import { stringNumberSchema } from "utils/validation";
import { z } from "zod";

const cardRouter = createApiRouter();

cardRouter.use(authenticated);

const querySchema = z.object({
  deckId: stringNumberSchema,
});

const bodySchema = z.object({
  obverse: z.string(),
  reverse: z.string(),
  type: z.enum([CardType.Normal, CardType.Reverse]).default(CardType.Normal),
  tags: z.array(z.string()).default([]),
});

// Add new card to the pointed deck
// POST api/decks/:deckId/card
cardRouter.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);
  const parsedBody = bodySchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success || !parsedBody.success) {
    sendError(new BadRequest("Invalid request body or parameters"));
    return;
  }

  const requestedDeck = await prisma.deck.findFirst({
    where: { id: parsedQuery.data.deckId, userId },
  });

  if (!requestedDeck) {
    sendError(new NotFound("Deck does not exist"));
    return;
  }

  const createdCard = await prisma.card.create({
    data: {
      deckId: parsedQuery.data.deckId,
      obverse: parsedBody.data.obverse,
      reverse: parsedBody.data.reverse,
      type: parsedBody.data.type,
      tags: {
        create: parsedBody.data.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              create: { name: tag },
              where: { name: tag },
            },
          },
        })),
      },
      memoDetails: {
        create: getDefaultMemoDetails(),
      },
    },
  });

  res.json(createdCard);
});

export default cardRouter.mount();
