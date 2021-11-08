import { Box, VStack } from "@chakra-ui/react";
import { Nullable } from "domains";
import React from "react";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export default function CustomTooltip<
  TData,
  TValue extends ValueType = ValueType,
  TName extends NameType = NameType
>(
  props: TooltipProps<TValue, TName> & {
    render: (data: TData) => JSX.Element;
  }
): Nullable<JSX.Element> {
  const data: TData | undefined = props.payload?.[0]?.payload;

  if (!data) {
    return null;
  }

  return (
    <Box
      boxShadow="md"
      borderRadius="sm"
      background="gray.700"
      color="whiteAlpha.900"
      opacity={0.9}
      p={2}
    >
      <VStack spacing={0} align="flex-start">
        {props.render(data)}
      </VStack>
    </Box>
  );
}
