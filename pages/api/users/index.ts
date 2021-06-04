import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";

const usersRouter = createApiRouter();

usersRouter.get(async (req, res) => {
  const users = prisma.user.findMany({
    include: {
      profile: {
        include: { avatar: true },
      },
      decks: true,
    },
  });

  res.json(await users);
});

export default usersRouter.mount();
