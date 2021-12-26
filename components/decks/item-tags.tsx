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

interface ItemTagsProps extends WrapProps {
  tags: DetailedCard["tags"];
  size?: TagProps["size"];
}

export default function ItemTags({
  tags,
  size,
  ...wrapProps
}: ItemTagsProps): JSX.Element {
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
