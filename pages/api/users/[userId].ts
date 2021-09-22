import createApiHandler from "lib/nc";
import prisma from "lib/prisma";

const usersHandler = createApiHandler();

usersHandler.get(async (req, res) => {
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

export default usersHandler;
