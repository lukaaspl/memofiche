import { BadRequest, Conflict, InternalServerError } from "http-errors";
import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { z } from "zod";

const decksRouter = createApiRouter();

decksRouter.use(authenticated);

decksRouter.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  const userDecks = await prisma.deck.findMany({ where: { userId } });

  res.send(userDecks);
});

const bodySchema = z.object({
  name: z.string(),
  tags: z.array(z.string()).default([]),
});

decksRouter.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedBody = bodySchema.safeParse(req.body);

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

  const createdDeck = await prisma.deck.create({
    data: {
      name: req.body.name,
      userId,
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
    },
  });

  res.status(201).json(createdDeck);
});

export default decksRouter.mount();
