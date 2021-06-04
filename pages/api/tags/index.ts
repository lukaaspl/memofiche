import prisma from "lib/prisma";
import { createApiRouter } from "utils/api-router";
import { authenticated } from "utils/auth";

const tagsRouter = createApiRouter();

tagsRouter.use(authenticated);

tagsRouter.get(async (req, res) => {
  const tags = await prisma.tag.findMany();

  res.json(tags);
});

export default tagsRouter.mount();
