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
import MotionTr from "components/ui/motion-tr";
import SyncSpinner from "components/ui/sync-spinner";
import dayjs from "dayjs";
import { EnhancedDeckWithCards } from "domains/deck";
import Link from "next/link";
import React from "react";
import { MdPlayCircleFilled } from "react-icons/md";
import { arrayPadEnd } from "utils/array";
import { prettyRound } from "utils/string";

const TABLE_HEADINGS: ({ label: string } & TableColumnHeaderProps)[] = [
  { label: "Name" },
  { label: "Available cards" },
  { label: "Last studied" },
  { label: "Study", textAlign: "center" },
];

interface MostRelevantDecksTableProps {
  decks: EnhancedDeckWithCards[];
  limit: number;
  isRefetching: boolean;
}

export default function MostRelevantDecksTable({
  decks,
  limit,
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
          {arrayPadEnd(decks, limit).map((item) => {
            if (!item.hasValue) {
              return (
                <MotionTr
                  key={item.index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 0.75, x: 0 }}
                  // @ts-ignore
                  transition={{ type: "tween", delay: item.index * 0.1 }}
                >
                  <Td height="57px" p={1}>
                    -
                  </Td>
                  <Td>-</Td>
                  <Td>-</Td>
                  <Td textAlign="center">-</Td>
                </MotionTr>
              );
            }

            const deck = item.value;

            const percentageRatio = prettyRound(
              (deck.studyingCardsCount / deck.cardsCount) * 100 || 0
            ).concat("%");

            const isStudyingDisabled = deck.studyingCardsCount === 0;

            return (
              <MotionTr
                key={item.index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: isStudyingDisabled ? 0.75 : 1, x: 0 }}
                // @ts-ignore
                transition={{ type: "tween", delay: item.index * 0.1 }}
              >
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
              </MotionTr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
