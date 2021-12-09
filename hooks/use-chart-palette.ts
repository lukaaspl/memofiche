import { Theme, useColorModeValue, useTheme } from "@chakra-ui/react";
import { useMemo } from "react";

interface ChartPalette {
  primary: string;
  primaryDark: string;
  grid: string;
  cursor: string;
}

export default function useChartPalette(): ChartPalette {
  const theme = useTheme<Theme>();

  const primary = useColorModeValue(
    theme.colors.purple[500],
    theme.colors.purple[300]
  );

  const primaryDark = useColorModeValue(
    theme.colors.purple[700],
    theme.colors.purple[500]
  );

  const grid = useColorModeValue(
    theme.colors.gray[200],
    theme.colors.gray[700]
  );

  const cursor = useColorModeValue(
    theme.colors.gray[300],
    theme.colors.gray[600]
  );

  return useMemo(
    () => ({ primary, primaryDark, grid, cursor }),
    [cursor, grid, primary, primaryDark]
  );
}
