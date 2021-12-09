import {
  BackgroundProps,
  ColorProps,
  EffectProps,
  useColorMode,
} from "@chakra-ui/react";
import { useCallback } from "react";

export type ColorThemeValue = ColorProps["color"];
export type BackgroundColorThemeValue = BackgroundProps["backgroundColor"];
export type BoxShadowThemeValue = EffectProps["boxShadow"];

type AvailableMode = "color" | "backgroundColor" | "boxShadow";

type InferredType<TMode extends AvailableMode> = TMode extends "color"
  ? ColorThemeValue
  : TMode extends "backgroundColor"
  ? BackgroundColorThemeValue
  : TMode extends "boxShadow"
  ? BoxShadowThemeValue
  : never;

type UseTypedColorModeValue<TMode extends AvailableMode> = (
  value1: InferredType<TMode>,
  value2: InferredType<TMode>
) => InferredType<TMode>;

export default function useTypedColorModeValue<TMode extends AvailableMode>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode: TMode
): UseTypedColorModeValue<TMode> {
  const { colorMode } = useColorMode();

  return useCallback(
    (value1, value2) => (colorMode === "light" ? value1 : value2),
    [colorMode]
  );
}
