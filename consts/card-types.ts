import { CardType } from "@prisma/client";
import { defineMessage, MessageDescriptor } from "react-intl";

export interface CardTypeDetails {
  type: CardType;
  titleDescriptor: MessageDescriptor;
  descDescriptor: MessageDescriptor;
}

export const cardTypeDetailsByType: Record<CardType, CardTypeDetails> = {
  [CardType.Normal]: {
    titleDescriptor: defineMessage({
      defaultMessage: "Basic",
      description: "Normal card type",
    }),
    descDescriptor: defineMessage({
      defaultMessage:
        "Basic, double-sided card being flipped from the obverse to the reverse while studying",
    }),
    type: CardType.Normal,
  },
  [CardType.Reverse]: {
    titleDescriptor: defineMessage({
      defaultMessage: "Reverse",
      description: "Reverse card type",
    }),
    descDescriptor: defineMessage({
      defaultMessage:
        "Same card type as normal with the difference that there's a 50% chance to swipe the sides (from the reverse to the obverse)",
    }),
    type: CardType.Reverse,
  },
};

export const cardTypeDetails = Object.values(cardTypeDetailsByType);
