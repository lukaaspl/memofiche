import { createApiRouter } from "utils/api-router";
import { authenticated } from "utils/auth";

const secretRouter = createApiRouter();

secretRouter.use(authenticated);

secretRouter.get((_, res) => {
  res.send({
    secret: Math.random().toString().substr(2),
  });
});

export default secretRouter.mount();
