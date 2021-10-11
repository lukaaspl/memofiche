import { BadRequest, InternalServerError, NotFound } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { getInitialSMParams } from "utils/super-memo";
import { postCardBodySchema, stringNumberSchema } from "utils/validation";
import { z } from "zod";

const cardHandler = createApiHandler();

cardHandler.use(authenticated);

const querySchema = z.object({
  deckId: stringNumberSchema,
});

// Add new card to the pointed deck
// POST api/decks/:deckId/card
cardHandler.post(async (req, res) => {
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

  const requestedDeck = await prisma.deck.findFirst({
    where: { id: parsedQuery.data.deckId, userId },
  });

  if (!requestedDeck) {
    sendError(new NotFound("Deck does not exist"));
    return;
  }

  try {
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
        memoParams: {
          create: getInitialSMParams(),
        },
      },
    });

    res.json(createdCard);
  } catch {
    sendError(new InternalServerError("Couldn't create deck's card entity"));
  }
});

export default cardHandler;
