import { BadRequest, Unauthorized } from "http-errors";
import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { comparePasswords, signToken } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import { z } from "zod";

const loginHandler = createApiHandler();

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

loginHandler.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const parsedBody = bodySchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendError(new BadRequest("Invalid request body"));
    return;
  }

  const requestedUser = await prisma.user.findUnique({
    where: { email: parsedBody.data.email },
  });

  if (!requestedUser) {
    sendError(new Unauthorized("Invalid credentials (user not found)"));
    return;
  }

  const passwordsMatch = await comparePasswords(
    parsedBody.data.password,
    requestedUser.password
  );

  if (!passwordsMatch) {
    sendError(new Unauthorized("Invalid credentials (incorrect password)"));
    return;
  }

  const token = signToken(requestedUser.id);

  res.status(200).json({ token });
});

export default loginHandler;
