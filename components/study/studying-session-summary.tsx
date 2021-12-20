import {
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
import Span from "components/ui/span";
import { Nullable } from "domains";
import { StudySessionsWithDeviations } from "domains/study";
import { motion, TargetAndTransition, useAnimation } from "framer-motion";
import useTranslation from "hooks/use-translation";
import Link from "next/link";
import React, { useEffect } from "react";
import { prettyDuration } from "utils/date-time";
import { prettyRound } from "utils/string";

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
  const { $t } = useTranslation();

  return (
    <>
      <StatLabel>{stat.label}</StatLabel>
      <StatNumber>{stat.value}</StatNumber>
      <Flex mt={1} justify="center" align="center">
        <Tooltip
          hasArrow
          label={
            <Text fontSize="small" p={0.5}>
              {$t({ defaultMessage: "compared to this deck" })}
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
                <Span fontWeight="bold">
                  {prettyRound(Math.abs(stat.currentDeckAvg * 100), 2).concat(
                    "%"
                  )}
                </Span>
              </>
            ) : (
              <Span fontWeight="bold">
                {$t({ defaultMessage: "no deviation" })}
              </Span>
            )}
          </StatHelpText>
        </Tooltip>
        <Tooltip
          hasArrow
          label={
            <Text fontSize="small" p={0.5}>
              {$t({ defaultMessage: "compared to all your decks" })}
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
                {prettyRound(Math.abs(stat.allDecksAvg * 100), 2).concat("%")}
              </>
            ) : (
              $t({ defaultMessage: "no deviation" })
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
  const { $t } = useTranslation();
  const [upperStatsControls, lowerStatsControls, ctasControls] = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ];

  const { relativeToCurrentDeck, relativeToAllDecks } = data.deviations;

  const upperStats: SessionStudyStatRecord[] = [
    {
      label: $t({ defaultMessage: "Studied cards" }),
      value: data.studiedCards,
      currentDeckAvg: relativeToCurrentDeck.studiedCards,
      allDecksAvg: relativeToAllDecks.studiedCards,
    },
    {
      label: $t({ defaultMessage: "Well-known cards" }),
      value: data.positiveCards,
      currentDeckAvg: relativeToCurrentDeck.positiveCards,
      allDecksAvg: relativeToAllDecks.positiveCards,
    },
    {
      label: $t({ defaultMessage: "Little-known cards" }),
      value: data.negativeCards,
      currentDeckAvg: relativeToCurrentDeck.negativeCards,
      allDecksAvg: relativeToAllDecks.negativeCards,
    },
  ];

  const lowerStats: SessionStudyStatRecord[] = [
    {
      label: $t({ defaultMessage: "Study time" }),
      value: prettyDuration(data.studyTime),
      currentDeckAvg: relativeToCurrentDeck.studyTime,
      allDecksAvg: relativeToAllDecks.studyTime,
    },
    {
      label: $t({ defaultMessage: "Avg. time per card" }),
      value: prettyDuration(data.avgTimePerCard, {
        milliseconds: true,
        decimals: true,
      }),
      currentDeckAvg: relativeToCurrentDeck.avgTimePerCard,
      allDecksAvg: relativeToAllDecks.avgTimePerCard,
    },
    {
      label: $t({ defaultMessage: "Avg. rate" }),
      value: prettyRound(data.avgRate, 2),
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
            <CustomButton colorScheme="purple">
              {$t({ defaultMessage: "Study another deck" })}
            </CustomButton>
          </Link>
          <Text>{$t({ defaultMessage: "or" })}</Text>
          <Link href="/" passHref>
            <CustomButton colorScheme="gray">
              {$t({ defaultMessage: "Visit the dashboard" })}
            </CustomButton>
          </Link>
        </HStack>
      </MotionBox>
    </>
  );
}
