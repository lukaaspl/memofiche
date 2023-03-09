import {
  BadRequest,
  Conflict,
  InternalServerError,
  UnprocessableEntity,
} from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { createUser } from "repositories/user";
import { signToken } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

const registerHandler = createApiHandler();

registerHandler.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const parsedBody = bodySchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  try {
    const emailAlreadyExist = Boolean(
      await prisma.user.findUnique({
        where: { email: parsedBody.data.email },
      })
    );

    if (emailAlreadyExist) {
      sendError(new Conflict("E-mail already exists"));
      return;
    }
  } catch {
    sendError(new InternalServerError());
    return;
  }

  try {
    const createdUser = await createUser({
      email: parsedBody.data.email,
      password: parsedBody.data.password,
      name: parsedBody.data.name,
    });

    const token = signToken(createdUser.id);

    res.status(200).json({ token });
  } catch {
    sendError(new UnprocessableEntity());
  }
});

export default registerHandler;
