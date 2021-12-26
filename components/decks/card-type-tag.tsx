import { Tag, TagLabel, TagLeftIcon, TagProps } from "@chakra-ui/react";
import { CardType } from "@prisma/client";
import { cardTypeDetailsByType } from "consts/card-types";
import useTranslation from "hooks/use-translation";
import React from "react";
import { BsCardText } from "react-icons/bs";
import { MdRepeat } from "react-icons/md";

interface CardTypeTagProps extends TagProps {
  cardType: CardType;
}

export default function CardTypeTag({
  cardType,
  ...tagProps
}: CardTypeTagProps): JSX.Element {
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
