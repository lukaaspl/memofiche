import {
  BadRequest,
  Conflict,
  InternalServerError,
  UnprocessableEntity,
} from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { hashPassword, signToken } from "utils/auth";
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
    const createdUser = await prisma.user.create({
      data: {
        email: parsedBody.data.email,
        password: await hashPassword(parsedBody.data.password),
        name: parsedBody.data.name,
        profile: {
          create: {
            avatar: {
              create: {},
            },
          },
        },
        config: {
          create: {},
        },
      },
    });

    const token = signToken(createdUser.id);

    res.status(200).json({ token });
  } catch {
    sendError(new UnprocessableEntity());
  }
});

export default registerHandler;
