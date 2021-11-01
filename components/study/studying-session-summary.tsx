import {
  Button,
  Flex,
  HStack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatProps,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import MotionBox from "components/ui/motion-box";
import { Nullable } from "domains";
import { StudySessionsWithDeviations } from "domains/study";
import { motion, TargetAndTransition, useAnimation } from "framer-motion";
import Link from "next/link";
import React, { useEffect } from "react";
import { prettyDuration } from "utils/date-time";

interface SessionStudyStatRecord {
  label: string;
  value: React.ReactNode;
  currentDeckAvg: Nullable<number>;
  allDecksAvg: Nullable<number>;
}

interface SessionStudyStatContentProps {
  stat: SessionStudyStatRecord;
}

function SessionStudyStatContent({
  stat,
}: SessionStudyStatContentProps): JSX.Element {
  return (
    <>
      <StatLabel>{stat.label}</StatLabel>
      <StatNumber>{stat.value}</StatNumber>
      <Flex mt={1} justify="center" align="center">
        <Tooltip
          hasArrow
          label={
            <Text fontSize="small" p={0.5}>
              compared to this deck
            </Text>
          }
          placement="bottom"
          openDelay={300}
        >
          <StatHelpText mr={3} cursor="help">
            {stat.currentDeckAvg ? (
              <>
                <StatArrow
                  type={stat.currentDeckAvg > 0 ? "increase" : "decrease"}
                />
                <Text as="span" fontWeight="bold">
                  {Math.abs(stat.currentDeckAvg * 100)
                    .toFixed(2)
                    .concat("%")}
                </Text>
              </>
            ) : (
              <Text as="span" fontWeight="bold">
                no deviation
              </Text>
            )}
          </StatHelpText>
        </Tooltip>
        <Tooltip
          hasArrow
          label={
            <Text fontSize="small" p={0.5}>
              compared to all your decks
            </Text>
          }
          placement="bottom"
          openDelay={300}
        >
          <StatHelpText cursor="help">
            {stat.allDecksAvg ? (
              <>
                <StatArrow
                  type={stat.allDecksAvg > 0 ? "increase" : "decrease"}
                />
                {Math.abs(stat.allDecksAvg * 100)
                  .toFixed(2)
                  .concat("%")}
              </>
            ) : (
              "no deviation"
            )}
          </StatHelpText>
        </Tooltip>
      </Flex>
    </>
  );
}

interface StudyingSessionSummaryProps {
  data: StudySessionsWithDeviations;
}

const MotionStat = motion<StatProps>(Stat);

export default function StudyingSessionSummary({
  data,
}: StudyingSessionSummaryProps): JSX.Element {
  const [upperStatsControls, lowerStatsControls, ctasControls] = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ];

  const { relativeToCurrentDeck, relativeToAllDecks } = data.deviations;

  const upperStats: SessionStudyStatRecord[] = [
    {
      label: "Studied cards",
      value: data.studiedCards,
      currentDeckAvg: relativeToCurrentDeck.studiedCards,
      allDecksAvg: relativeToAllDecks.studiedCards,
    },
    {
      label: "Well-known cards",
      value: data.positiveCards,
      currentDeckAvg: relativeToCurrentDeck.positiveCards,
      allDecksAvg: relativeToAllDecks.positiveCards,
    },
    {
      label: "Little-known cards",
      value: data.negativeCards,
      currentDeckAvg: relativeToCurrentDeck.negativeCards,
      allDecksAvg: relativeToAllDecks.negativeCards,
    },
  ];

  const lowerStats: SessionStudyStatRecord[] = [
    {
      label: "Study time",
      value: prettyDuration(data.studyTime),
      currentDeckAvg: relativeToCurrentDeck.studyTime,
      allDecksAvg: relativeToAllDecks.studyTime,
    },
    {
      label: "Avg. time per card",
      value: prettyDuration(data.avgTimePerCard),
      currentDeckAvg: relativeToCurrentDeck.avgTimePerCard,
      allDecksAvg: relativeToAllDecks.avgTimePerCard,
    },
    {
      label: "Avg. rate",
      value: data.avgRate.toFixed(2),
      currentDeckAvg: relativeToCurrentDeck.avgRate,
      allDecksAvg: relativeToAllDecks.avgRate,
    },
  ];

  useEffect(() => {
    async function sequence(): Promise<void> {
      const baseProps: TargetAndTransition = { opacity: 1, y: 0 };

      upperStatsControls.start((index: number) => ({
        ...baseProps,
        transition: { delay: 0.5 + index * 0.25 },
      }));

      await lowerStatsControls.start((index: number) => ({
        ...baseProps,
        transition: { delay: 0.5 + index * 0.25 },
      }));

      ctasControls.start(baseProps);
    }

    sequence();
  }, [ctasControls, lowerStatsControls, upperStatsControls]);

  return (
    <>
      <StatGroup mt={8} textAlign="center">
        {upperStats.map((stat, index) => (
          <MotionStat
            key={index}
            initial={{ opacity: 0, y: -30 }}
            animate={upperStatsControls}
            custom={index}
          >
            <SessionStudyStatContent stat={stat} />
          </MotionStat>
        ))}
      </StatGroup>
      <StatGroup mt={8} textAlign="center">
        {lowerStats.map((stat, index) => (
          <MotionStat
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={lowerStatsControls}
            custom={index}
          >
            <SessionStudyStatContent stat={stat} />
          </MotionStat>
        ))}
      </StatGroup>
      <MotionBox initial={{ opacity: 0, y: 30 }} animate={ctasControls}>
        <HStack justify="center" mt={12} spacing={3}>
          <Link href="/study" passHref>
            <CustomButton colorScheme="purple">Study another deck</CustomButton>
          </Link>
          <Text>or</Text>
          <Link href="/" passHref>
            <CustomButton colorScheme="gray">Visit the dashboard</CustomButton>
          </Link>
        </HStack>
      </MotionBox>
    </>
  );
}