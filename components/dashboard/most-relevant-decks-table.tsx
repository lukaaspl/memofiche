import {
  Box,
  Flex,
  Heading,
  IconButton,
  Table,
  TableColumnHeaderProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import SyncSpinner from "components/ui/sync-spinner";
import dayjs from "dayjs";
import { EnhancedDeckWithCards } from "domains/deck";
import Link from "next/link";
import React from "react";
import { MdPlayCircleFilled } from "react-icons/md";
import { prettyRound } from "utils/string";

const TABLE_HEADINGS: ({ label: string } & TableColumnHeaderProps)[] = [
  { label: "Name" },
  { label: "Available cards" },
  { label: "Last studied" },
  { label: "Study", textAlign: "center" },
];

interface MostRelevantDecksTableProps {
  decks: EnhancedDeckWithCards[];
  isRefetching: boolean;
}

export default function MostRelevantDecksTable({
  decks,
  isRefetching,
}: MostRelevantDecksTableProps): JSX.Element {
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
          Most relevant decks
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
          {decks.map((deck) => {
            const percentageRatio = prettyRound(
              (deck.studyingCardsCount / deck.cardsCount) * 100 || 0
            ).concat("%");

            const isStudyingDisabled = deck.studyingCardsCount === 0;

            return (
              <Tr key={deck.id} opacity={isStudyingDisabled ? 0.75 : 1}>
                <Td p={1}>{deck.name}</Td>
                <Td>
                  {deck.studyingCardsCount}/{deck.cardsCount} ({percentageRatio}
                  )
                </Td>
                <Td>
                  {deck.lastStudied
                    ? dayjs(deck.lastStudied).fromNow()
                    : "never"}
                </Td>
                <Td textAlign="center">
                  <Link href={`/study/${deck.id}`} passHref>
                    <IconButton
                      isDisabled={isStudyingDisabled}
                      aria-label="Study deck"
                      color="purple.500"
                      fontSize="x-large"
                      icon={<MdPlayCircleFilled />}
                      variant="ghost"
                    />
                  </Link>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
