import { StudySession } from ".prisma/client";
import { DateMetricSample } from "domains";
import { Prisma } from "lib/prisma";
import {
  findStudySessionsByUserId,
  getStudySessionsAvgsRelativeToUserDeck,
} from "repositories/study";
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

export type StudySummarySample = DateMetricSample<
  Record<
    keyof Pick<
      StudySession,
      "studiedCards" | "positiveCards" | "negativeCards" | "studyTime"
    >,
    { sum: number; mean: number }
  >
>;

export type StudySessionWithDeck = NonNullable<
  Prisma.PromiseReturnType<typeof findStudySessionsByUserId>
>[0];

export interface StudyingOverview {
  studyingSummary: StudySummarySample[];
  lastSessions: StudySessionWithDeck[];
}

export enum RatingControlMode {
  Basic,
  Advanced,
}
