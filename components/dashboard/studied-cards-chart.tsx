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
import CustomButton from "components/shared/custom-button";
import Span from "components/shared/span";
import SyncSpinner from "components/shared/sync-spinner";
import { STUDIED_CARDS_CHART_TOTAL } from "consts/storage-keys";
import dayjs from "dayjs";
import { StudySummarySample } from "domains/study";
import useChartPalette from "hooks/use-chart-palette";
import useTranslation from "hooks/use-translation";
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
  const chartPalette = useChartPalette();
  const { $t } = useTranslation();

  return (
    <Box>
      <Flex
        mb={7}
        direction={{ base: "column", sm: "row" }}
        justify={{ base: "flex-start", sm: "space-between" }}
        align={{ base: "flex-start", sm: "center" }}
      >
        <Flex align="center">
          <Heading
            color={chartPalette.primary}
            fontWeight="bold"
            textTransform="uppercase"
            fontFamily="Poppins"
            fontSize="xl"
            letterSpacing="wider"
          >
            {isTotalMode
              ? $t({ defaultMessage: "Total studied cards" })
              : $t({ defaultMessage: "Avg. studied cards" })}
          </Heading>
          {isRefetching && <SyncSpinner />}
        </Flex>
        <ButtonGroup
          colorScheme="purple"
          size="sm"
          isAttached
          variant="outline"
          mt={{ base: 2, sm: 0 }}
        >
          <CustomButton
            onClick={() => setIsTotalMode(() => true)}
            mr="-1px"
            variant={isTotalMode ? "solid" : "outline"}
          >
            &sum; {$t({ defaultMessage: "Total" })}
          </CustomButton>
          <CustomButton
            onClick={() => setIsTotalMode(() => false)}
            variant={isTotalMode ? "outline" : "solid"}
          >
            X&#772; {$t({ defaultMessage: "Avg." })}
          </CustomButton>
        </ButtonGroup>
      </Flex>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart margin={{ right: 30 }} data={data}>
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
              fill: chartPalette.primaryDark,
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
              fill: chartPalette.primaryDark,
            }}
            type="category"
            minTickGap={15}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(dateMs) => {
              const date = dayjs(dateMs);

              return date.isToday()
                ? $t({ defaultMessage: "Today" })
                : date.format("MMM DD");
            }}
            dataKey={(data: StudySummarySample) => data.date}
          />
          <CartesianGrid strokeDasharray="5" stroke={chartPalette.grid} />
          <Tooltip
            cursor={{
              fill: chartPalette.cursor,
              fillOpacity: 0.7,
            }}
            content={
              <CustomTooltip<StudySummarySample>
                render={(data) => (
                  <>
                    <Text fontSize="sm">{dayjs(data.date).format("LL")}</Text>
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      opacity={isTotalMode ? 1 : 0.6}
                    >
                      {$t({ defaultMessage: "Total studied cards" })}:{" "}
                      {data.value.studiedCards.sum} (
                      <Span color="green.400">
                        {data.value.positiveCards.sum}
                      </Span>
                      /
                      <Span color="red.400">
                        {data.value.negativeCards.sum}
                      </Span>
                      )
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      opacity={isTotalMode ? 0.6 : 1}
                    >
                      {$t({ defaultMessage: "Avg. studied cards" })}:{" "}
                      {prettyRound(data.value.studiedCards.mean)} (
                      <Span color="green.400">
                        {prettyRound(data.value.positiveCards.mean)}
                      </Span>
                      /
                      <Span color="red.400">
                        {prettyRound(data.value.negativeCards.mean)}
                      </Span>
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
          {
            color: "green.500",
            label: $t({ defaultMessage: "Positive cards" }),
          },
          {
            color: "red.500",
            label: $t({ defaultMessage: "Negative cards" }),
          },
        ]}
      />
    </Box>
  );
}
