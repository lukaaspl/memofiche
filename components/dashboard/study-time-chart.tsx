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
import { STUDY_TIME_CHART_TOTAL } from "consts/storage-keys";
import dayjs from "dayjs";
import { StudySummarySample } from "domains/study";
import useChartPalette from "hooks/use-chart-palette";
import useTranslation from "hooks/use-translation";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { prettyDuration } from "utils/date-time";
import ChartLegend from "./chart-legend";
import CustomTooltip from "./custom-tooltip";

interface StudyTimeChartProps {
  data: StudySummarySample[];
  isRefetching: boolean;
}

export default function StudyTimeChart({
  data,
  isRefetching,
}: StudyTimeChartProps): JSX.Element {
  const [isTotalMode, setIsTotalMode] = useLocalStorage(
    STUDY_TIME_CHART_TOTAL,
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
              ? $t({ defaultMessage: "Total study time" })
              : $t({ defaultMessage: "Avg. study time" })}
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
        <AreaChart margin={{ right: 30, left: 5 }} data={data}>
          <defs>
            <linearGradient id="studyTimeFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="10%"
                stopColor={chartPalette.primary}
                stopOpacity={0.8}
              />
              <stop
                offset="90%"
                stopColor={chartPalette.primary}
                stopOpacity={0}
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
            tickFormatter={(studyTime: number) => prettyDuration(studyTime)}
            dataKey={(data: StudySummarySample) =>
              data.value.studyTime[isTotalMode ? "sum" : "mean"]
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
            cursor={{ stroke: chartPalette.cursor }}
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
                      {$t({ defaultMessage: "Total study time" })}:{" "}
                      {prettyDuration(data.value.studyTime.sum)}
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      opacity={isTotalMode ? 0.6 : 1}
                    >
                      {$t({ defaultMessage: "Avg. study time" })}:{" "}
                      {prettyDuration(data.value.studyTime.mean)}
                    </Text>
                  </>
                )}
              />
            }
          />
          <Area
            key={Number(isTotalMode)}
            type="monotone"
            dataKey={(data: StudySummarySample) =>
              data.value.studyTime[isTotalMode ? "sum" : "mean"]
            }
            fill="url(#studyTimeFill)"
            stroke={chartPalette.primary}
          />
        </AreaChart>
      </ResponsiveContainer>
      <ChartLegend
        items={[
          {
            color: chartPalette.primary,
            label: $t({ defaultMessage: "Study time" }),
          },
        ]}
      />
    </Box>
  );
}
