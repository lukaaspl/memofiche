import { DeckSort, EnhancedDeckWithCards } from "domains/deck";
import { BadRequest, Conflict, InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { inRange, orderBy, sortBy } from "lodash";
import { findUserDecksWithCards } from "repositories/deck";
import { findStudySessionsByUserId } from "repositories/study";
import { authenticated, extractTokenUserId } from "utils/auth";
import { enhanceDecksWithStudyParams, sortDecksAdvanced } from "utils/decks";
import { httpErrorSender } from "utils/errors";
import { TagsConverter } from "utils/tags";
import {
  postDeckBodySchema,
  sortDecksQuerySchema,
  stringNumberSchema,
} from "utils/validation";

const decksHandler = createApiHandler();

decksHandler.use(authenticated);

const DECKS_LIMIT = 1_000;

const querySchema = sortDecksQuerySchema.extend({
  limit: stringNumberSchema
    .refine((value) => inRange(value, 1, DECKS_LIMIT + 1))
    .optional()
    .default(DECKS_LIMIT.toString()),
});

// Get user decks
// GET /api/decks
decksHandler.get(async (req, res) => {
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
    const { limit, ...sort } = parsedQuery.data;

    const userSessions = await findStudySessionsByUserId(userId);

    const decks = enhanceDecksWithStudyParams(
      await findUserDecksWithCards(userId, sort, limit),
      userSessions
    );

    const sortedDecks = sortDecksAdvanced(decks, sort);

    res.send(sortedDecks);
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
