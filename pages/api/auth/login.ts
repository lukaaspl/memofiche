import { BadRequest, Unauthorized } from "http-errors";
import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { comparePasswords, signToken } from "utils/auth";
import { httpErrorSender } from "utils/errors";

const loginRouter = createApiRouter();

loginRouter.post(async (req, res) => {
  const sendError = httpErrorSender(res);
  const { email, password } = req.body;

  if (!email || !password) {
    sendError(new BadRequest("Email and password are required fields"));
    return;
  }

  const requestedUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!requestedUser) {
    sendError(new Unauthorized("Invalid credentials (user not found)"));
    return;
  }

  const passwordsMatch = await comparePasswords(
    password,
    requestedUser.password
  );

  if (!passwordsMatch) {
    sendError(new Unauthorized("Invalid credentials (incorrect password)"));
    return;
  }

  const token = signToken(requestedUser.id.toString());

  res.status(200).json({ token });
});

export default loginRouter.mount();
