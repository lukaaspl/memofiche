import { BadRequest, InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { getInitialSMParams } from "utils/super-memo";
import { resetCardsQuerySchema } from "utils/validation";

const resetDeckCardsHandler = createApiHandler();

resetDeckCardsHandler.use(authenticated);

// Resets memo params for every card in the deck
// POST api/decks/:deckId/rate
resetDeckCardsHandler.put(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = resetCardsQuerySchema.safeParse(req.query);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query parameters"));
    return;
  }

  const shouldResetShallow = parsedQuery.data.mode === "shallow";

  try {
    await prisma.cardMemoParams.updateMany({
      where: {
        card: {
          deckId: parsedQuery.data.deckId,
        },
      },
      data: shouldResetShallow
        ? { dueDate: new Date() }
        : { ...getInitialSMParams() },
    });

    res.status(200).end();
  } catch {
    sendError(new InternalServerError());
  }
});

export default resetDeckCardsHandler;
