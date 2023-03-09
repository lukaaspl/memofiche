import { useMemo } from "react";
import useTypedColorModeValue, {
  BoxShadowThemeValue,
  ColorThemeValue,
} from "./use-typed-color-mode-value";

interface CommonPalette {
  primary: ColorThemeValue;
  primaryDark: ColorThemeValue;
  disabled: ColorThemeValue;
  green: ColorThemeValue;
  red: ColorThemeValue;
  whiteBlack: ColorThemeValue;
  blackWhite: ColorThemeValue;
  containerShadow: BoxShadowThemeValue;
}

export default function useCommonPalette(): CommonPalette {
  const primary = useTypedColorModeValue("color")("purple.500", "purple.300");
  const primaryDark = useTypedColorModeValue("color")(
    "purple.700",
    "purple.500"
  );
  const disabled = useTypedColorModeValue("color")("gray.200", "gray.500");
  const green = useTypedColorModeValue("color")("green.500", "green.300");
  const red = useTypedColorModeValue("color")("red.500", "red.300");
  const whiteBlack = useTypedColorModeValue("color")(
    "whiteAlpha.900",
    "blackAlpha.900"
  );
  const blackWhite = useTypedColorModeValue("color")(
    "blackAlpha.900",
    "whiteAlpha.900"
  );

  const containerShadow = useTypedColorModeValue("boxShadow")("lg", "2xl");

  return useMemo(
    () => ({
      primary,
      primaryDark,
      disabled,
      green,
      red,
      whiteBlack,
      blackWhite,
      containerShadow,
    }),
    [
      primary,
      primaryDark,
      disabled,
      green,
      red,
      whiteBlack,
      blackWhite,
      containerShadow,
    ]
  );
}
