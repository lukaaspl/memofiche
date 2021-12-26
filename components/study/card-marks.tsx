import {
  ChakraComponent,
  IconProps,
  Tag,
  TagProps,
  Tooltip,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { IconType } from "react-icons";

export interface CardMark {
  icon: ChakraComponent<IconType>;
  bgColor: TagProps["colorScheme"];
  color: IconProps["color"];
  label: string;
  isVisible: boolean;
}

interface CardMarksProps {
  marks: CardMark[];
}

const SPACE_BETWEEN_MARKS = 30;
const OFFSET_FROM_EDGE = 7;

interface CardMarkProps {
  mark: CardMark;
  index: number;
}

function CardMarkComponent({ mark, index }: CardMarkProps): JSX.Element {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const offset = (index * SPACE_BETWEEN_MARKS + OFFSET_FROM_EDGE)
    .toString()
    .concat("px");

  return (
    <Tooltip
      hasArrow
      isOpen={isTooltipOpen}
      label={mark.label}
      fontSize="sm"
      padding={1.5}
      placement="top"
    >
      <Tag
        position="absolute"
        right={offset}
        top={2}
        p={1}
        rounded="full"
        cursor="help"
        variant="solid"
        colorScheme={mark.bgColor}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onClick={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        <mark.icon color={mark.color} fontSize="md" />
      </Tag>
    </Tooltip>
  );
}

export default function CardMarks({ marks }: CardMarksProps): JSX.Element {
  const visibleMarks = useMemo(
    () => marks.filter((mark) => mark.isVisible),
    [marks]
  );

  return (
    <>
      {visibleMarks.map((mark, index) => (
        <CardMarkComponent key={index} mark={mark} index={index} />
      ))}
    </>
  );
}
