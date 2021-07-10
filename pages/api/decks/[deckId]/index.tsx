import { BadRequest, InternalServerError, NotFound } from "http-errors";
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

// Get current user pointed deck with cards
// GET api/decks/:deckId
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

  const detailedDeck = await prisma.deck.findFirst({
    where: { id: parsedQuery.data.deckId, userId },
    include: { cards: true },
  });

  if (!detailedDeck) {
    sendError(new NotFound("Deck does not exist"));
    return;
  }

  res.json(detailedDeck);
});

export default deckRouter.mount();
