import {
  Box,
  Flex,
  Heading,
  Table,
  TableColumnHeaderProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import MotionTr from "components/ui/motion-tr";
import Span from "components/ui/span";
import SyncSpinner from "components/ui/sync-spinner";
import dayjs from "dayjs";
import { StudySessionWithDeck } from "domains/study";
import useCommonPalette from "hooks/use-common-palette";
import useTranslation from "hooks/use-translation";
import React, { useMemo } from "react";
import { arrayPadEnd } from "utils/array";
import { prettyDuration } from "utils/date-time";

interface LastStudySessionsTableProps {
  sessions: StudySessionWithDeck[];
  limit: number;
  isRefetching: boolean;
}

export default function LastStudySessionsTable({
  sessions,
  limit,
  isRefetching,
}: LastStudySessionsTableProps): JSX.Element {
  const palette = useCommonPalette();
  const { $t } = useTranslation();

  const tableHeadings: ({ label: string } & TableColumnHeaderProps)[] = useMemo(
    () => [
      { label: $t({ defaultMessage: "Date" }) },
      { label: $t({ defaultMessage: "Deck" }) },
      { label: $t({ defaultMessage: "Studied cards" }) },
      { label: $t({ defaultMessage: "Time" }) },
    ],
    [$t]
  );

  return (
    <Box>
      <Flex mb={7} align="center">
        <Heading
          color={palette.primary}
          fontWeight="bold"
          textTransform="uppercase"
          fontFamily="Poppins"
          fontSize="xl"
          letterSpacing="wider"
        >
          {$t({ defaultMessage: "Last studied sessions" })}
        </Heading>
        {isRefetching && <SyncSpinner />}
      </Flex>
      <Table size="sm" colorScheme="purple">
        <Thead>
          <Tr>
            {tableHeadings.map(({ label, ...tableRowProps }, index) => (
              <Th
                key={index}
                fontSize="sm"
                fontFamily="Poppins"
                color={palette.primaryDark}
                {...tableRowProps}
              >
                {label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {arrayPadEnd(sessions, limit).map((item) => {
            if (!item.hasValue) {
              return (
                <MotionTr
                  key={item.index}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 0.75, x: 0 }}
                  transition={{ type: "tween", delay: item.index * 0.1 }}
                >
                  <Td height="57px">-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                  <Td>-</Td>
                </MotionTr>
              );
            }

            const session = item.value;

            const date =
              dayjs().diff(session.createdAt, "day") >= 1
                ? dayjs(session.createdAt).format("DD/MM/YYYY")
                : dayjs(session.createdAt).fromNow();

            return (
              <MotionTr
                key={item.index}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "tween", delay: item.index * 0.1 }}
              >
                <Td height="57px">{date}</Td>
                <Td>{session.deck.name}</Td>
                <Td>
                  {session.studiedCards} (
                  <Span color={palette.green}>{session.positiveCards}</Span>/
                  <Span color={palette.red}>{session.negativeCards}</Span>)
                </Td>
                <Td>{prettyDuration(session.studyTime)}</Td>
              </MotionTr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
