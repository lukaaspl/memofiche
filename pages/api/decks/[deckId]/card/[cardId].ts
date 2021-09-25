import { BadRequest, InternalServerError, NotFound } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { updateDeckCard } from "repositories/card";
import { findUserDeckWithSpecifiedCard } from "repositories/deck";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { postCardBodySchema, stringNumberSchema } from "utils/validation";
import { z } from "zod";

const specifiedCardHandler = createApiHandler();

specifiedCardHandler.use(authenticated);

const querySchema = z.object({
  deckId: stringNumberSchema,
  cardId: stringNumberSchema,
});

// Update specified deck's card
// PUT api/decks/:deckId/card/:cardId
specifiedCardHandler.put(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);
  const parsedBody = postCardBodySchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success || !parsedBody.success) {
    sendError(new BadRequest("Invalid request body or parameters"));
    return;
  }

  try {
    const requestedDeckWithSpecifiedCard = await findUserDeckWithSpecifiedCard(
      userId,
      parsedQuery.data.deckId,
      parsedQuery.data.cardId
    );

    if (
      !requestedDeckWithSpecifiedCard ||
      requestedDeckWithSpecifiedCard.cards.length === 0
    ) {
      sendError(new NotFound("Deck or specified card does not exist"));
      return;
    }

    const [requestedCard] = requestedDeckWithSpecifiedCard.cards;

    try {
      const updatedCard = await updateDeckCard(requestedCard, parsedBody.data);

      res.json(updatedCard);
    } catch {
      sendError(new InternalServerError("Couldn't update deck's card entity"));
    }
  } catch {
    sendError(
      new InternalServerError("Couldn't exec find operation on deck entity")
    );
  }
});

// Delete specified deck's card
// DELETE api/decks/:deckId/card/:cardId
specifiedCardHandler.delete(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query parameters"));
    return;
  }

  try {
    const requestedDeckWithSpecifiedCard = await findUserDeckWithSpecifiedCard(
      userId,
      parsedQuery.data.deckId,
      parsedQuery.data.cardId
    );

    if (
      !requestedDeckWithSpecifiedCard ||
      requestedDeckWithSpecifiedCard.cards.length === 0
    ) {
      sendError(new NotFound("Deck or specified card does not exist"));
      return;
    }

    try {
      const deletedCard = await prisma.card.delete({
        where: { id: parsedQuery.data.cardId },
      });

      res.json(deletedCard);
    } catch {
      sendError(
        new InternalServerError(
          "Couldn't exec delete operation on a card entity"
        )
      );
    }
  } catch {
    sendError(
      new InternalServerError("Couldn't exec find operation on a deck entity")
    );
  }
});

export default specifiedCardHandler;
