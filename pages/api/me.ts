import { InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import { findMeUser } from "repositories/user";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";

const meHandler = createApiHandler();

meHandler.use(authenticated);

// Get user data
// GET api/me
meHandler.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  try {
    const requestedUser = await findMeUser(userId);

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
