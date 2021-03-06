import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import Feedback from "components/shared/feedback";
import { DECKS_QUERY_KEY, STUDYING_OVERVIEW } from "consts/query-keys";
import {
  PostStudySessionRequestData,
  StudySessionsWithDeviations,
} from "domains/study";
import { StudyingState } from "hooks/use-studying";
import useTranslation from "hooks/use-translation";
import { authApiClient } from "lib/axios";
import { stringifyUrl } from "query-string";
import React, { useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { getStudyingSessionSummary } from "utils/study";
import StudyingSessionSummary from "./studying-session-summary";

interface StudyingSessionSummaryProps {
  deckId: number;
  state: StudyingState;
}

async function postStudySession(
  requestData: { deckId: number } & PostStudySessionRequestData
): Promise<StudySessionsWithDeviations> {
  const { deckId, ...data } = requestData;

  const url = stringifyUrl({
    url: "/study",
    query: { deckId },
  });

  const { data: studySession } =
    await authApiClient.post<StudySessionsWithDeviations>(url, data);

  return studySession;
}

export default function StudyingSessionFinalScreen({
  deckId,
  state,
}: StudyingSessionSummaryProps): JSX.Element {
  const queryClient = useQueryClient();
  const { $t } = useTranslation();

  const { mutate, data, isLoading, isError } = useMutation(postStudySession, {
    onSuccess: () => {
      queryClient.invalidateQueries(DECKS_QUERY_KEY);
      queryClient.invalidateQueries(STUDYING_OVERVIEW);
    },
  });

  const createStudySession = useCallback(() => {
    const summary = getStudyingSessionSummary(state);
    mutate({ deckId, ...summary });
  }, [deckId, mutate, state]);

  useEffect(createStudySession, [createStudySession]);

  return (
    <>
      <Alert
        status="success"
        variant="top-accent"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize={{ base: "30px", md: "45px" }} mr={0} />
        <AlertTitle
          mt={4}
          mb={2}
          fontSize={{ base: "xl", md: "2xl" }}
          fontFamily="Poppins"
          textTransform="uppercase"
        >
          {$t({ defaultMessage: "Session finished" })}
        </AlertTitle>
        <AlertDescription fontSize={{ base: "sm", md: "md" }} maxWidth="md">
          {$t({
            defaultMessage:
              "You have successfully completed your studying session. Grab a few statistics to find out how you did.",
          })}
        </AlertDescription>
      </Alert>
      {isError ? (
        <Feedback
          mt={8}
          type="error"
          actionButtonLabel="Retry"
          onAction={createStudySession}
        />
      ) : isLoading || !data ? (
        <Feedback type="loading" delay={0.5} mt={8} />
      ) : (
        <StudyingSessionSummary data={data} />
      )}
    </>
  );
}
