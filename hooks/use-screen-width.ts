import { Theme, useMediaQuery, useTheme } from "@chakra-ui/react";

interface UseScreenWidth {
  isLargerThanSM: boolean;
  isLargerThanMD: boolean;
  isLargerThanLG: boolean;
  isLargerThanXL: boolean;
  isLargerThan2XL: boolean;
}

export default function useScreenWidth(): UseScreenWidth {
  const { breakpoints } = useTheme<Theme>();

  const [
    isLargerThanSM,
    isLargerThanMD,
    isLargerThanLG,
    isLargerThanXL,
    isLargerThan2XL,
  ] = useMediaQuery([
    `(min-width: ${breakpoints.sm})`,
    `(min-width: ${breakpoints.md})`,
    `(min-width: ${breakpoints.lg})`,
    `(min-width: ${breakpoints.xl})`,
    `(min-width: ${breakpoints["2xl"]})`,
  ]);

  return {
    isLargerThanSM,
    isLargerThanMD,
    isLargerThanLG,
    isLargerThanXL,
    isLargerThan2XL,
  };
}
