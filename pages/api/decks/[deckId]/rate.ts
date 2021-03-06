import { BadRequest, InternalServerError, NotFound } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { superMemo } from "utils/super-memo";
import { stringNumberSchema, superMemoQualitySchema } from "utils/validation";
import { z } from "zod";

const rateCardHandler = createApiHandler();

rateCardHandler.use(authenticated);

const querySchema = z.object({
  deckId: stringNumberSchema,
});

const bodySchema = z.object({
  cardId: z.number(),
  grade: superMemoQualitySchema,
});

// Rate card in pointed deck
// POST api/decks/:deckId/rate
rateCardHandler.post(async (req, res) => {
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

  const requestedCard = await prisma.card.findFirst({
    where: {
      deck: { userId },
      deckId: parsedQuery.data.deckId,
      id: parsedBody.data.cardId,
    },
    include: {
      memoParams: true,
    },
  });

  if (!requestedCard) {
    sendError(new NotFound("Deck or card does not exist"));
    return;
  }

  if (!requestedCard.memoParams) {
    sendError(new InternalServerError());
    return;
  }

  const updatedMemoParams = superMemo(
    requestedCard.memoParams,
    parsedBody.data.grade
  );

  const updatedCardWithMemoParams = await prisma.card.update({
    where: {
      id: parsedBody.data.cardId,
    },
    data: {
      memoParams: {
        update: updatedMemoParams,
      },
    },
    include: {
      memoParams: true,
    },
  });

  res.json(updatedCardWithMemoParams);
});

export default rateCardHandler;
