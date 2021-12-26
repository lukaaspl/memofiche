import { Tag, TagLabel, TagLeftIcon, TagProps } from "@chakra-ui/react";
import { CardType } from "@prisma/client";
import { cardTypeDetailsByType } from "consts/card-types";
import useTranslation from "hooks/use-translation";
import React from "react";
import { BsCardText } from "react-icons/bs";
import { MdRepeat } from "react-icons/md";

interface CardItemTypeTagProps extends TagProps {
  cardType: CardType;
}

export default function CardItemTypeTag({
  cardType,
  ...tagProps
}: CardItemTypeTagProps): JSX.Element {
  const { $t } = useTranslation();

  return (
    <Tag variant="solid" colorScheme="purple" {...tagProps}>
      <TagLeftIcon
        as={cardType === CardType.Reverse ? MdRepeat : BsCardText}
        fontSize={19}
      />
      <TagLabel>{$t(cardTypeDetailsByType[cardType].titleDescriptor)}</TagLabel>
    </Tag>
  );
}
