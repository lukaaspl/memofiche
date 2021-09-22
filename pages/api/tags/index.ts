import createApiHandler from "lib/nc";
import prisma from "lib/prisma";
import { authenticated } from "utils/auth";

const tagsHandler = createApiHandler();

tagsHandler.use(authenticated);

tagsHandler.get(async (req, res) => {
  const tags = await prisma.tag.findMany();

  res.json(tags);
});

export default tagsHandler;
