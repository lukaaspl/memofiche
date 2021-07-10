import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { InternalServerError } from "http-errors";

const meRouter = createApiRouter();

meRouter.use(authenticated);

meRouter.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

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
});

export default meRouter.mount();
