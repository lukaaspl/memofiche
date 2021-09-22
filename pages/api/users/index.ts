import createApiHandler from "lib/nc";
import prisma from "lib/prisma";

const usersHandler = createApiHandler();

usersHandler.get(async (req, res) => {
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

export default usersHandler;
