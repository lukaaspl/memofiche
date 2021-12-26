import {
  Tag,
  TagLabel,
  TagProps,
  Wrap,
  WrapItem,
  WrapProps,
} from "@chakra-ui/react";
import { DetailedCard } from "domains/card";
import React from "react";
import { TagsConverter } from "utils/tags";

interface TagsProps extends WrapProps {
  tags: DetailedCard["tags"];
  size?: TagProps["size"];
}

export default function Tags({
  tags,
  size,
  ...wrapProps
}: TagsProps): JSX.Element {
  return (
    <Wrap {...wrapProps}>
      {TagsConverter.extractNames(tags).map((tagName, index) => (
        <WrapItem key={index}>
          <Tag size={size} variant="subtle" colorScheme="purple">
            <TagLabel>{tagName}</TagLabel>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  );
}
