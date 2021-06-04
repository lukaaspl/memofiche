import { BadRequest, UnprocessableEntity } from "http-errors";
import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { hashPassword, signToken } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { z } from "zod";

const registerRouter = createApiRouter();

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

registerRouter.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const parsedBody = bodySchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        email: parsedBody.data.email,
        password: await hashPassword(parsedBody.data.password),
        name: parsedBody.data.name,
        profile: {
          create: {},
        },
      },
    });

    const token = signToken(createdUser.id);

    res.status(200).json({ token });
  } catch (e) {
    sendError(new UnprocessableEntity(e.message));
  }
});

export default registerRouter.mount();
