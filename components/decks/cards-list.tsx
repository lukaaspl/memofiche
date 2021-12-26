import {
  Box,
  Heading,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Feedback from "components/ui/feedback";
import { DetailedCard } from "domains/card";
import { DeckTag } from "domains/tags";
import useCommonPalette from "hooks/use-common-palette";
import useScreenWidth from "hooks/use-screen-width";
import useTranslation from "hooks/use-translation";
import { truncate } from "lodash";
import React, { useMemo } from "react";
import CardItemMenu from "./card-item-menu";
import CardItemTypeTag from "./card-item-type-tag";
import ItemTags from "./item-tags";

const CARD_CHARS_LIMIT = 150;

function shortenCardText(value: string): string {
  return truncate(value, { length: CARD_CHARS_LIMIT });
}

interface CardsListProps {
  cards: DetailedCard[];
  deckTags: DeckTag[];
  onNewCardDialogOpen: () => void;
}

export default function CardsList({
  cards,
  deckTags,
  onNewCardDialogOpen,
}: CardsListProps): JSX.Element {
  const { isLargerThanMD } = useScreenWidth();
  const { $t } = useTranslation();
  const palette = useCommonPalette();

  const headings = useMemo(
    () => ({
      type: $t({ defaultMessage: "Type" }),
      obverse: $t({ defaultMessage: "Obverse" }),
      reverse: $t({ defaultMessage: "Reverse" }),
      tags: $t({ defaultMessage: "Tags" }),
    }),
    [$t]
  );

  if (cards.length === 0) {
    return (
      <Feedback
        type="empty-state"
        message={$t({ defaultMessage: "There was no card found" })}
        actionButtonLabel={$t({
          defaultMessage: "Add first",
          description: "Add first card button",
        })}
        onAction={onNewCardDialogOpen}
      />
    );
  }

  return (
    <>
      {isLargerThanMD ? (
        <Table mt={5} variant="simple" colorScheme="purple">
          <Thead>
            <Tr>
              {Object.values(headings)
                .concat("")
                .map((heading) => (
                  <Th
                    key={heading}
                    fontSize="sm"
                    fontFamily="Poppins"
                    color={palette.primaryDark}
                  >
                    {heading}
                  </Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {cards.map((card) => (
              <Tr key={card.id}>
                <Td>
                  <CardItemTypeTag cardType={card.type} />
                </Td>
                <Td>
                  <Text>{shortenCardText(card.obverse)}</Text>
                </Td>
                <Td>
                  <Text>{shortenCardText(card.reverse)}</Text>
                </Td>
                <Td>
                  <ItemTags tags={card.tags} />
                </Td>
                <Td textAlign="right">
                  <CardItemMenu card={card} deckTags={deckTags} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        cards.map((card) => (
          <Box
            key={card.id}
            mt={6}
            p={3}
            pb={10}
            borderTop="4px solid"
            borderColor={palette.primary}
            borderRadius="md"
            minH="130px"
            position="relative"
            boxShadow="md"
          >
            <SimpleGrid columns={2} spacing={4} width="90%">
              <Box>
                <Heading
                  size="xs"
                  fontFamily="Poppins"
                  color={palette.primary}
                  mb={1}
                >
                  {headings.obverse}
                </Heading>
                <Text>{shortenCardText(card.obverse)}</Text>
              </Box>
              <Box>
                <Heading
                  size="xs"
                  fontFamily="Poppins"
                  color={palette.primary}
                  mb={1}
                >
                  {headings.reverse}
                </Heading>
                <Text>{shortenCardText(card.reverse)}</Text>
              </Box>
              {card.tags.length > 0 && (
                <Box gridColumn="1 / 3">
                  <Heading
                    size="xs"
                    fontFamily="Poppins"
                    color={palette.primary}
                    mb={2}
                  >
                    {headings.tags}
                  </Heading>
                  <ItemTags tags={card.tags} />
                </Box>
              )}
            </SimpleGrid>
            <CardItemTypeTag
              cardType={card.type}
              borderRadius="none"
              borderTopLeftRadius="lg"
              position="absolute"
              bottom="0"
              right="0"
            />
            <CardItemMenu
              position="absolute"
              right="0"
              top="0"
              card={card}
              deckTags={deckTags}
            />
          </Box>
        ))
      )}
    </>
  );
}
