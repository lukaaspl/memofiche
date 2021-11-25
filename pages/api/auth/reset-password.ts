import { BadRequest, InternalServerError, Unauthorized } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import {
  authenticated,
  comparePasswords,
  extractTokenUserId,
  hashPassword,
} from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { resetPasswordBodySchema } from "utils/validation";

const resetPasswordHandler = createApiHandler();

resetPasswordHandler.use(authenticated);

// Reset password
// POST api/reset-password
resetPasswordHandler.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedBody = resetPasswordBodySchema.safeParse(req.body);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  try {
    const requestedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!requestedUser) {
      throw new Error();
    }

    const passwordsMatch = await comparePasswords(
      parsedBody.data.oldPassword,
      requestedUser.password
    );

    if (!passwordsMatch) {
      sendError(new Unauthorized("Passwords don't match"));
      return;
    }

    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: await hashPassword(parsedBody.data.newPassword),
        },
      });

      res.status(200).end();
    } catch {
      throw new Error();
    }
  } catch {
    sendError(new InternalServerError());
  }
});

export default resetPasswordHandler;
