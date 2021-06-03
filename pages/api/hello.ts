import { createApiRouter } from "utils/api-router";

const router = createApiRouter();

router.get((req, res) => {
  res.send("Hello on the GET endpoint");
});

router.post((req, res) => {
  res.send("Hello on the POST endpoint");
});

export default router.mount();
