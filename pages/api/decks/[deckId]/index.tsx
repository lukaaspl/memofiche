import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
} from "http-errors";
import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { stringNumberSchema } from "utils/validation";
import { z } from "zod";

const deckRouter = createApiRouter();

deckRouter.use(authenticated);

const querySchema = z.object({
  deckId: stringNumberSchema,
});

deckRouter.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query params"));
    return;
  }

  const detailedDeck = await prisma.deck.findUnique({
    where: { id: parsedQuery.data.deckId },
    include: { cards: true },
  });

  if (!detailedDeck) {
    sendError(new NotFound("Deck does not exist"));
    return;
  }

  if (detailedDeck.userId !== Number(userId)) {
    sendError(new Forbidden("Deck does not belong to the user"));
    return;
  }

  res.json(detailedDeck);
});

export default deckRouter.mount();
