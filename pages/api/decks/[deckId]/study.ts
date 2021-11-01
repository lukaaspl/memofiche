import { CardMemoParams } from ".prisma/client";
import {
  BadRequest,
  InternalServerError,
  isHttpError,
  NotFound,
} from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import {
  getStudySessionsAvgsRelativeToAllUserDecks,
  getStudySessionsAvgsRelativeToUserDeck,
} from "repositories/study";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { getStudySessionsDeviations } from "utils/study";
import { superMemo } from "utils/super-memo";
import {
  postStudySessionBodySchema,
  stringNumberSchema,
} from "utils/validation";
import { z } from "zod";

const studyDeckHandler = createApiHandler();

studyDeckHandler.use(authenticated);

const querySchema = z.object({
  deckId: stringNumberSchema,
});

// Add study session and rate cards in pointed deck
// Replacement endpoint for api/decks/:deckId/rate
// POST api/decks/:deckId/study
studyDeckHandler.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);
  const parsedBody = postStudySessionBodySchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success || !parsedBody.success) {
    sendError(new BadRequest("Invalid request body or parameters"));
    return;
  }

  try {
    const deckCards = await prisma.card.findMany({
      where: { deckId: parsedQuery.data.deckId },
      select: { id: true, memoParams: true },
    });

    if (deckCards.length === 0) {
      throw new BadRequest("The deck is empty");
    }

    const memoParamsByCardId = deckCards.reduce((map, card) => {
      if (card.memoParams) {
        map.set(card.id, card.memoParams);
      }

      return map;
    }, new Map<number, CardMemoParams>());

    const updateCardsQueries = Object.keys(parsedBody.data.cardGrades).map(
      (cardIdStr) => {
        const cardId = Number(cardIdStr);
        const grade = parsedBody.data.cardGrades[cardIdStr];
        const currentSMParams = memoParamsByCardId.get(cardId);

        if (!currentSMParams) {
          throw new NotFound(`Card ${cardIdStr} was not found`);
        }

        const updatedSMParams = superMemo(currentSMParams, grade);

        return prisma.card.update({
          where: {
            id: cardId,
          },
          data: {
            memoParams: {
              update: updatedSMParams,
            },
          },
        });
      }
    );

    const createSessionQuery = prisma.studySession.create({
      data: {
        deckId: parsedQuery.data.deckId,
        studyTime: parsedBody.data.studyTime,
        avgTimePerCard: parsedBody.data.avgTimePerCard,
        avgRate: parsedBody.data.avgRate,
        studiedCards: parsedBody.data.studiedCards,
        positiveCards: parsedBody.data.positiveCards,
        negativeCards: parsedBody.data.negativeCards,
      },
    });

    try {
      const [
        studySessionsAvgsRelativeToUserDeck,
        studySessionsAvgsRelativeToAllUserDecks,
        createdStudySession,
      ] = await prisma.$transaction([
        getStudySessionsAvgsRelativeToUserDeck(parsedQuery.data.deckId),
        getStudySessionsAvgsRelativeToAllUserDecks(userId),
        createSessionQuery,
        // uncomment to start updating cards memo parameters while adding new study session
        ...updateCardsQueries,
      ]);

      const deviations = getStudySessionsDeviations(
        parsedBody.data,
        studySessionsAvgsRelativeToUserDeck._avg,
        studySessionsAvgsRelativeToAllUserDecks._avg
      );

      res.json({ ...createdStudySession, deviations });
    } catch (e) {
      sendError(
        new InternalServerError(
          "Couldn't create a study session or update the cards"
        )
      );
      return;
    }
  } catch (e) {
    sendError(isHttpError(e) ? e : new InternalServerError());
    return;
  }
});

export default studyDeckHandler;
