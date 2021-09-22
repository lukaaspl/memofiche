import { BadRequest, InternalServerError, NotFound } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { findUserDeck } from "repositories/deck";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { postDeckBodySchema, stringNumberSchema } from "utils/validation";
import { z } from "zod";

const deckHandler = createApiHandler();

deckHandler.use(authenticated);

const querySchema = z.object({
  deckId: stringNumberSchema,
});

// Get current user pointed deck with cards
// GET api/decks/:deckId
deckHandler.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);

  if (!userId) {
    sendError(new InternalServerError("Couldn't extract user id"));
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query params"));
    return;
  }

  try {
    const detailedDeck = await findUserDeck(userId, parsedQuery.data.deckId);

    if (!detailedDeck) {
      sendError(new NotFound("Deck does not exist"));
      return;
    }

    res.json(detailedDeck);
  } catch {
    sendError(
      new InternalServerError("Couldn't exec find operation on deck entity")
    );
  }
});

// Update pointed deck
// PUT api/decks/:deckId
deckHandler.put(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);
  const parsedBody = postDeckBodySchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError("Couldn't extract user id"));
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query params"));
    return;
  }

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  try {
    const updatedDeck = await prisma.deck.update({
      where: { id: parsedQuery.data.deckId },
      data: {
        name: parsedBody.data.name,
        tags: {
          set: [],
          create: parsedBody.data.tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                create: { name: tag },
                where: { name: tag },
              },
            },
          })),
        },
      },
    });

    res.json(updatedDeck);
  } catch {
    sendError(new InternalServerError("Couldn't create deck entity"));
  }
});

// Delete pointed deck
// DELETE api/decks/:deckId
deckHandler.delete(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);

  if (!userId) {
    sendError(new InternalServerError("Couldn't extract user id"));
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query params"));
    return;
  }

  try {
    const deletedDeck = await prisma.deck.delete({
      where: { id: parsedQuery.data.deckId },
    });

    res.json(deletedDeck);
  } catch {
    sendError(new InternalServerError("Couldn't delete deck entity"));
  }
});

export default deckHandler;
