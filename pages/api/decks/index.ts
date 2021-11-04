import { BadRequest, Conflict, InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { findUserDecksWithCards } from "repositories/deck";
import { authenticated, extractTokenUserId } from "utils/auth";
import { enhanceDecksWithStudyParams } from "utils/decks";
import { httpErrorSender } from "utils/errors";
import { TagsConverter } from "utils/tags";
import { postDeckBodySchema, sortDecksQuerySchema } from "utils/validation";

const decksHandler = createApiHandler();

decksHandler.use(authenticated);

// Get user decks
// GET /api/decks
decksHandler.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = sortDecksQuerySchema.safeParse(req.query);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query parameters"));
    return;
  }

  try {
    const sort = parsedQuery.data;

    const decks = enhanceDecksWithStudyParams(
      await findUserDecksWithCards(userId, sort)
    );

    if (sort && sort.sortBy === "studyingCardsCount") {
      decks.sort((deckA, deckB) => {
        const a = deckA.studyingCardsCount;
        const b = deckB.studyingCardsCount;
        return sort.order === "asc" ? a - b : b - a;
      });
    } else if (sort && sort.sortBy === "studyingCardsPercentage") {
      decks.sort((deckA, deckB) => {
        const a = deckA.studyingCardsCount / deckA.cardsCount || 0;
        const b = deckB.studyingCardsCount / deckB.cardsCount || 0;
        return sort.order === "asc" ? a - b : b - a;
      });
    }

    res.send(decks);
  } catch {
    sendError(new InternalServerError());
  }
});

// Add new deck
// POST /api/decks
decksHandler.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedBody = postDeckBodySchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  const deckAlreadyExist = Boolean(
    await prisma.deck.findUnique({
      where: {
        userId_name: {
          name: parsedBody.data.name,
          userId,
        },
      },
    })
  );

  if (deckAlreadyExist) {
    sendError(new Conflict("Deck with such name already exist"));
    return;
  }

  try {
    const normalizedTags = TagsConverter.normalize(parsedBody.data.tags);

    const createdDeck = await prisma.deck.create({
      data: {
        name: parsedBody.data.name,
        userId,
        isFavorite: parsedBody.data.isFavorite,
        tags: {
          create: normalizedTags.map((tag) => ({
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

    res.status(201).json(createdDeck);
  } catch {
    sendError(new InternalServerError("Couldn't create deck entity"));
  }
});

export default decksHandler;
