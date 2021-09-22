import createApiHandler from "lib/nc";
import { authenticated } from "utils/auth";

const secretHandler = createApiHandler();

secretHandler.use(authenticated);

secretHandler.get((_, res) => {
  res.send({
    secret: Math.random().toString().substr(2),
  });
});

export default secretHandler;
