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
import { formatTickValue, prettyDuration } from "utils/date-time";
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
            {isTotalMode ? "Total study time" : "Avg. study time"}
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
        <AreaChart margin={{ right: 30, left: 5 }} data={data}>
          <defs>
            <linearGradient id="studyTimeFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="10%"
                stopColor={theme.colors.purple["500"]}
                stopOpacity={0.8}
              />
              <stop
                offset="90%"
                stopColor={theme.colors.purple["500"]}
                stopOpacity={0}
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
              stroke: theme.colors.gray[300],
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
                      Total study time:{" "}
                      {prettyDuration(data.value.studyTime.sum)}
                    </Text>
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      opacity={isTotalMode ? 0.6 : 1}
                    >
                      Avg. study time:{" "}
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
            stroke={theme.colors.purple["500"]}
          />
        </AreaChart>
      </ResponsiveContainer>
      <ChartLegend items={[{ color: "purple.500", label: "Study time" }]} />
    </Box>
  );
}
