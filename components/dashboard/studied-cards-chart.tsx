import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Text,
  Theme,
  useTheme,
} from "@chakra-ui/react";
import { useLocalStorage } from "beautiful-react-hooks";
import CustomButton from "components/ui/custom-button";
import SyncSpinner from "components/ui/sync-spinner";
import { STUDIED_CARDS_CHART_TOTAL } from "consts/storage-keys";
import dayjs from "dayjs";
import { StudySummarySample } from "domains/study";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatTickValue } from "utils/date-time";
import { prettyRound } from "utils/string";
import ChartLegend from "./chart-legend";
import CustomTooltip from "./custom-tooltip";

interface StudiedCardsChartProps {
  data: StudySummarySample[];
  isRefetching: boolean;
}

export default function StudiedCardsChart({
  data,
  isRefetching,
}: StudiedCardsChartProps): JSX.Element {
  const [isTotalMode, setIsTotalMode] = useLocalStorage(
    STUDIED_CARDS_CHART_TOTAL,
    true
  );

  const theme = useTheme<Theme>();

  return (
    <Box>
      <Flex mb={7} justify="space-between" align="center">
        <Flex align="center">
          <Heading
            color="purple.500"
            fontWeight="bold"
            textTransform="uppercase"
            fontFamily="Poppins"
            fontSize="xl"
            letterSpacing="wider"
          >
            {isTotalMode ? "Total studied cards" : "Avg. studied cards"}
          </Heading>
          {isRefetching && <SyncSpinner />}
        </Flex>
        <ButtonGroup
          colorScheme="purple"
          size="sm"
          isAttached
          variant="outline"
        >
          <CustomButton
            onClick={() => setIsTotalMode(() => true)}
            mr="-1px"
            variant={isTotalMode ? "solid" : "outline"}
          >
            &sum; Total
          </CustomButton>
          <CustomButton
            onClick={() => setIsTotalMode(() => false)}
            variant={isTotalMode ? "outline" : "solid"}
          >
            X&#772; Avg.
          </CustomButton>
        </ButtonGroup>
      </Flex>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart margin={{ right: 30, left: 5 }} data={data}>
          <defs>
            <linearGradient id="positiveCardsFill" x1="0" y1="1" x2="0" y2="0">
              <stop
                offset="10%"
                stopColor={theme.colors.green[400]}
                stopOpacity={0.8}
              />
              <stop
                offset="90%"
                stopColor={theme.colors.green[400]}
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="negativeCardsFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="10%"
                stopColor={theme.colors.red[400]}
                stopOpacity={0.8}
              />
              <stop
                offset="90%"
                stopColor={theme.colors.red[400]}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <YAxis
            style={{
              fontFamily: "Poppins",
              fontSize: theme.fontSizes.sm,
              fill: theme.colors.purple[700],
            }}
            type="number"
            minTickGap={15}
            tickMargin={5}
            axisLine={false}
            tickLine={false}
            dataKey={(data: StudySummarySample) =>
              data.value.studiedCards[isTotalMode ? "sum" : "mean"]
            }
          />
          <XAxis
            style={{
              textTransform: "uppercase",
              fontFamily: "Poppins",
              fontSize: theme.fontSizes.sm,
              fill: theme.colors.purple[700],
            }}
            type="category"
            minTickGap={15}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatTickValue}
            dataKey={(data: StudySummarySample) => data.date}
          />
          <CartesianGrid strokeDasharray="5" stroke={theme.colors.gray[200]} />
          <Tooltip
            cursor={{
              fill: theme.colors.gray[200],
              fillOpacity: 0.7,
            }}
            content={
              <CustomTooltip<StudySummarySample>
                render={(data) => (
                  <>
                    <Text fontSize="sm">
                      {dayjs(data.date).format("MMMM DD")}
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      opacity={isTotalMode ? 1 : 0.6}
                    >
                      Total studied cards: {data.value.studiedCards.sum} (
                      <Text as="span" color="green.400">
                        {data.value.positiveCards.sum}
                      </Text>
                      /
                      <Text as="span" color="red.400">
                        {data.value.negativeCards.sum}
                      </Text>
                      )
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      opacity={isTotalMode ? 0.6 : 1}
                    >
                      Avg. studied cards:{" "}
                      {prettyRound(data.value.studiedCards.mean)} (
                      <Text as="span" color="green.400">
                        {prettyRound(data.value.positiveCards.mean)}
                      </Text>
                      /
                      <Text as="span" color="red.400">
                        {prettyRound(data.value.negativeCards.mean)}
                      </Text>
                      )
                    </Text>
                  </>
                )}
              />
            }
          />
          <Bar
            key={Number(isTotalMode)}
            dataKey={(data: StudySummarySample) =>
              data.value.positiveCards[isTotalMode ? "sum" : "mean"]
            }
            stackId="1"
            fill="url(#positiveCardsFill)"
            stroke={theme.colors.green[500]}
            strokeWidth={0.5}
          />
          <Bar
            key={Number(isTotalMode) + 1}
            dataKey={(data: StudySummarySample) =>
              data.value.negativeCards[isTotalMode ? "sum" : "mean"]
            }
            stackId="1"
            stroke={theme.colors.red[500]}
            strokeWidth={0.5}
            fill="url(#negativeCardsFill)"
          />
        </BarChart>
      </ResponsiveContainer>
      <ChartLegend
        items={[
          { color: "green.500", label: "Positive cards" },
          { color: "red.500", label: "Negative cards" },
        ]}
      />
    </Box>
  );
}
