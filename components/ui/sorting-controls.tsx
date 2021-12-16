import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  FlexProps,
  FormControl,
  FormLabel,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { BaseSort, SortOrder } from "domains";
import useTranslation from "hooks/use-translation";
import React from "react";

interface SortControlsProps<TFields extends string> extends FlexProps {
  state: BaseSort<TFields>;
  options: { value: TFields; label: string }[];
  onChangeField: (field: TFields) => void;
  onChangeOrder: (order: SortOrder) => void;
}

export default function SortingControls<TFields extends string>({
  state,
  options,
  onChangeField,
  onChangeOrder,
  ...flexProps
}: SortControlsProps<TFields>): JSX.Element {
  const { $t } = useTranslation();
  const isASC = state.order === "asc";

  return (
    <Flex {...flexProps}>
      <FormControl
        w="280px"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        mr={1}
      >
        <FormLabel mb={0}>{$t({ defaultMessage: "Sort by" })}</FormLabel>
        <Select
          w="190px"
          onChange={(event) => onChangeField(event.target.value as TFields)}
          value={state.sortBy}
        >
          {options.map((field, index) => (
            <option key={index} value={field.value}>
              {field.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <IconButton
        aria-label={$t({ defaultMessage: "Sort in descending order" })}
        icon={<ArrowDownIcon fontSize="2xl" />}
        variant="ghost"
        color={isASC ? "gray.400" : "purple.600"}
        pointerEvents={isASC ? "all" : "none"}
        onClick={() => onChangeOrder("desc")}
      />
      <IconButton
        aria-label={$t({ defaultMessage: "Sort in ascending order" })}
        icon={<ArrowUpIcon fontSize="2xl" />}
        variant="ghost"
        color={isASC ? "purple.600" : "gray.400"}
        pointerEvents={isASC ? "none" : "all"}
        onClick={() => onChangeOrder("asc")}
      />
    </Flex>
  );
}
