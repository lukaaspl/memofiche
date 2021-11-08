import {
  Box,
  Flex,
  Heading,
  Table,
  TableColumnHeaderProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import SyncSpinner from "components/ui/sync-spinner";
import dayjs from "dayjs";
import { StudySessionWithDeck } from "domains/study";
import React from "react";
import { prettyDuration } from "utils/date-time";

const TABLE_HEADINGS: ({ label: string } & TableColumnHeaderProps)[] = [
  { label: "Date" },
  { label: "Deck" },
  { label: "Studied cards" },
  { label: "Time" },
];

interface LastStudySessionsTableProps {
  sessions: StudySessionWithDeck[];
  isRefetching: boolean;
}

export default function LastStudySessionsTable({
  sessions,
  isRefetching,
}: LastStudySessionsTableProps): JSX.Element {
  return (
    <Box>
      <Flex mb={7} align="center">
        <Heading
          color="purple.500"
          fontWeight="bold"
          textTransform="uppercase"
          fontFamily="Poppins"
          fontSize="xl"
          letterSpacing="wider"
        >
          Last studied sessions
        </Heading>
        {isRefetching && <SyncSpinner />}
      </Flex>
      <Table size="sm" colorScheme="purple">
        <Thead>
          <Tr>
            {TABLE_HEADINGS.map(({ label, ...tableRowProps }, index) => (
              <Th
                key={index}
                fontSize="sm"
                fontFamily="Poppins"
                color="purple.700"
                {...tableRowProps}
              >
                {label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sessions.map((session) => {
            const date =
              dayjs().diff(session.createdAt, "day") >= 1
                ? dayjs(session.createdAt).format("DD/MM/YYYY")
                : dayjs(session.createdAt).fromNow();

            return (
              <Tr key={session.id}>
                <Td height="57px">{date}</Td>
                <Td>{session.deck.name}</Td>
                <Td>
                  {session.studiedCards} (
                  <Text as="span" color="green.500">
                    {session.positiveCards}
                  </Text>
                  /
                  <Text as="span" color="red.500">
                    {session.negativeCards}
                  </Text>
                  )
                </Td>
                <Td>{prettyDuration(session.studyTime)}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
