import { InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";

const meHandler = createApiHandler();

meHandler.use(authenticated);

meHandler.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  try {
    const requestedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    if (!requestedUser) {
      sendError(new InternalServerError());
      return;
    }

    res.json(requestedUser);
  } catch {
    sendError(new InternalServerError());
  }
});

export default meHandler;
