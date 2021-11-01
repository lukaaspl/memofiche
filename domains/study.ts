import { StudySession } from ".prisma/client";
import { Prisma } from "lib/prisma";
import { getStudySessionsAvgsRelativeToUserDeck } from "repositories/study";
import { postStudySessionBodySchema } from "utils/validation";
import { z } from "zod";

export type PostStudySessionRequestData = z.input<
  typeof postStudySessionBodySchema
>;

export type StudySessionsAverages = Prisma.PromiseReturnType<
  typeof getStudySessionsAvgsRelativeToUserDeck
>["_avg"];

export interface StudySessionsDeviations {
  relativeToCurrentDeck: StudySessionsAverages;
  relativeToAllDecks: StudySessionsAverages;
}

export type StudySessionsWithDeviations = StudySession & {
  deviations: StudySessionsDeviations;
};
