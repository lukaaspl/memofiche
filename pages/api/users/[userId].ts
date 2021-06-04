import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";

const usersRouter = createApiRouter();

usersRouter.get(async (req, res) => {
  const userId = req.query.userId as string;

  const user = await prisma.user.findUnique({
    where: {
      id: +userId,
    },
    include: {
      profile: {
        include: {
          avatar: true,
        },
      },
    },
  });

  res.json(user);
});

export default usersRouter.mount();
