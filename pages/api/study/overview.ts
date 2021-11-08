import { StudyingOverview } from "domains/study";
import { BadRequest, InternalServerError } from "http-errors";
import createApiHandler from "lib/nc";
import { inRange } from "lodash";
import { findStudySessionsByUserId } from "repositories/study";
import { authenticated, extractTokenUserId } from "utils/auth";
import { httpErrorSender } from "utils/errors";
import {
  generateStudyingSummaryForLastXDays,
  getLastXStudySessions,
} from "utils/study";
import { stringNumberSchema } from "utils/validation";
import { z } from "zod";

const studyingOverviewHandler = createApiHandler();

studyingOverviewHandler.use(authenticated);

const MAX_PERIOD_IN_DAYS = 30;
const MAX_LAST_SESSIONS_LIMIT = 100;

const querySchema = z.object({
  period: stringNumberSchema.refine((number) =>
    inRange(number, 1, MAX_PERIOD_IN_DAYS + 1)
  ),
  limit: stringNumberSchema.refine((number) =>
    inRange(number, 1, MAX_LAST_SESSIONS_LIMIT + 1)
  ),
});

// Returns studying summary
// GET api/study/summary
studyingOverviewHandler.get(async (req, res) => {
  const sendError = httpErrorSender(res);
  const userId = extractTokenUserId(req);
  const parsedQuery = querySchema.safeParse(req.query);

  if (!userId) {
    sendError(new InternalServerError());
    return;
  }

  if (!parsedQuery.success) {
    sendError(new BadRequest("Invalid query parameters"));
    return;
  }

  try {
    const { period, limit } = parsedQuery.data;

    const sessions = await findStudySessionsByUserId(userId, period);

    const overview: StudyingOverview = {
      studyingSummary: generateStudyingSummaryForLastXDays(sessions, period),
      lastSessions: getLastXStudySessions(sessions, limit),
    };

    res.json(overview);
  } catch {
    sendError(new InternalServerError());
  }
});

export default studyingOverviewHandler;
