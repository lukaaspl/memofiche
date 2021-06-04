import { BadRequest, UnprocessableEntity } from "http-errors";
import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { hashPassword, signToken } from "utils/auth";
import { httpErrorSender } from "utils/errors";

const registerRouter = createApiRouter();

registerRouter.post(async (req, res) => {
  const sendError = httpErrorSender(res);

  if (!req.body.email || !req.body.password || !req.body.name) {
    sendError(new BadRequest("Email, password and name are required fields"));
    return;
  }

  try {
    const createdUser = await prisma.user.create({
      data: {
        email: req.body.email,
        password: await hashPassword(req.body.password),
        name: req.body.name,
        profile: {
          create: {},
        },
      },
    });

    const token = signToken(createdUser.id.toString());

    res.status(200).json({ token });
  } catch (e) {
    sendError(new UnprocessableEntity(e.message));
  }
});

export default registerRouter.mount();
