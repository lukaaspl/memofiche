import { InternalServerError, BadRequest } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { updateConfigSchema } from "utils/validation";

const configHandler = createApiHandler();

configHandler.use(authenticated);

// Update user config
// PUT api/config
configHandler.put(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedBody = updateConfigSchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  try {
    const updatedConfig = await prisma.config.update({
      where: { userId },
      data: parsedBody.data,
    });

    res.json(updatedConfig);
  } catch {
    sendError(new InternalServerError());
  }
});

export default configHandler;
