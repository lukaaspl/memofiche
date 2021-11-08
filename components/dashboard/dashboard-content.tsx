import { SimpleGrid } from "@chakra-ui/react";
import LastStudySessionsTable from "components/dashboard/last-study-sessions-table";
import MostRelevantDecksTable from "components/dashboard/most-relevant-decks-table";
import StudiedCardsChart from "components/dashboard/studied-cards-chart";
import StudyTimeChart from "components/dashboard/study-time-chart";
import Feedback from "components/ui/feedback";
import { STUDYING_OVERVIEW } from "consts/query-keys";
import { StudyingOverview } from "domains/study";
import useDecksQuery from "hooks/use-decks-query";
import { authApiClient } from "lib/axios";
import { stringifyUrl } from "query-string";
import React from "react";
import { useQuery } from "react-query";

async function fetchStudyingOverview(
  periodInDays: number,
  lastSessionsLimit: number
): Promise<StudyingOverview> {
  const url = stringifyUrl({
    url: "/study/overview",
    query: {
      period: periodInDays,
      limit: lastSessionsLimit,
    },
  });

  const { data: overview } = await authApiClient.get<StudyingOverview>(url);

  return overview;
}

const SUMMARY_PERIOD_IN_DAYS = 14;
const TABLE_ITEMS_LIMIT = 5;

export default function DashboardContent(): JSX.Element {
  const overviewQuery = useQuery(STUDYING_OVERVIEW, () =>
    fetchStudyingOverview(SUMMARY_PERIOD_IN_DAYS, TABLE_ITEMS_LIMIT)
  );

  const decksQuery = useDecksQuery({
    sortBy: "studyingCardsPercentage",
    order: "desc",
    limit: TABLE_ITEMS_LIMIT,
  });

  const handleRefetchOnError = (): void => {
    if (overviewQuery.isError) {
      overviewQuery.refetch();
    } else if (decksQuery.isError) {
      decksQuery.refetch();
    }
  };

  if (overviewQuery.isError || decksQuery.isError) {
    return (
      <Feedback
        type="error"
        actionButtonLabel="Retry"
        onAction={handleRefetchOnError}
      />
    );
  }

  if (!overviewQuery.data || !decksQuery.data) {
    return <Feedback type="loading" />;
  }

  const { data: overview } = overviewQuery;
  const { data: decks } = decksQuery;

  return (
    <SimpleGrid mt={6} columns={2} spacingX={12} spacingY={10}>
      <StudyTimeChart
        data={overview.studyingSummary}
        isRefetching={overviewQuery.isRefetching}
      />
      <StudiedCardsChart
        data={overview.studyingSummary}
        isRefetching={overviewQuery.isRefetching}
      />
      <MostRelevantDecksTable
        decks={decks}
        limit={TABLE_ITEMS_LIMIT}
        isRefetching={decksQuery.isRefetching}
      />
      <LastStudySessionsTable
        sessions={overview.lastSessions}
        limit={TABLE_ITEMS_LIMIT}
        isRefetching={overviewQuery.isRefetching}
      />
    </SimpleGrid>
  );
}
