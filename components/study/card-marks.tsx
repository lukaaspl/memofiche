import {
  ChakraComponent,
  IconProps,
  Tag,
  TagProps,
  Tooltip,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { IconType } from "react-icons";

export interface CardMark {
  icon: ChakraComponent<IconType>;
  bgColor: TagProps["colorScheme"];
  color: IconProps["color"];
  label: string;
  isVisible: boolean;
}

interface CardMarkProps {
  marks: CardMark[];
}

const SPACE_BETWEEN_MARKS = 30;
const OFFSET_FROM_EDGE = 7;

export default function CardMarkComponent({
  marks,
}: CardMarkProps): JSX.Element {
  const visibleMarks = useMemo(
    () => marks.filter((mark) => mark.isVisible),
    [marks]
  );

  return (
    <>
      {visibleMarks.map((mark, index) => {
        const offset = (index * SPACE_BETWEEN_MARKS + OFFSET_FROM_EDGE)
          .toString()
          .concat("px");

        return (
          <Tooltip
            key={index}
            hasArrow
            label={mark.label}
            fontSize="sm"
            padding={1.5}
            placement="top"
          >
            <Tag
              rounded="full"
              cursor="help"
              position="absolute"
              right={offset}
              top={2}
              p={1}
              variant="solid"
              colorScheme={mark.bgColor}
            >
              <mark.icon color={mark.color} fontSize="md" />
            </Tag>
          </Tooltip>
        );
      })}
    </>
  );
}
