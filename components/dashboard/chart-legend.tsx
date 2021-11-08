import { Box, BoxProps, Flex, HStack, Text } from "@chakra-ui/react";
import { Nullable } from "domains";
import React from "react";

interface ChartLegendProps {
  items: {
    color: BoxProps["backgroundColor"];
    label: string;
  }[];
}

export default function ChartLegend({
  items,
}: ChartLegendProps): Nullable<JSX.Element> {
  return (
    <HStack mt={3} justify="center" align="center" spacing={4}>
      {items.map((item, index) => (
        <Flex key={index} align="center">
          <Box
            w="10px"
            h="5px"
            borderRadius="md"
            backgroundColor={item.color}
            mr={2}
          />
          <Text fontFamily="Poppins" fontSize="small">
            {item.label}
          </Text>
        </Flex>
      ))}
    </HStack>
  );
}
