import { Box, Stack, Tag, TagLabel, Text } from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import CustomDialog from "components/ui/custom-dialog";
import { DetailedCard } from "domains/card";
import useTranslation from "hooks/use-translation";
import React, { useMemo } from "react";
import { TagsConverter } from "utils/tags";

interface CardDetailsDialogProps {
  card: DetailedCard;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardDetailsDialog({
  card,
  isOpen,
  onClose,
}: CardDetailsDialogProps): JSX.Element {
  const { $t } = useTranslation();

  const cardDetailsSections = useMemo(
    () => [
      {
        header: $t({ defaultMessage: "Obverse" }),
        content: card.obverse,
      },
      {
        header: $t({ defaultMessage: "Reverse" }),
        content: card.reverse,
      },
      {
        header: $t({ defaultMessage: "Type" }),
        content: card.type,
      },
      {
        header: $t({ defaultMessage: "Note" }),
        content: card.note,
      },
      {
        header: $t({ defaultMessage: "Tags" }),
        content: TagsConverter.toString(card.tags),
      },
      {
        header: $t({ defaultMessage: "Creation date" }),
        content: new Date(card.createdAt).toLocaleString(),
      },
      {
        header: $t({ defaultMessage: "Last modification date" }),
        content: new Date(card.updatedAt).toLocaleString(),
      },
    ],
    [$t, card]
  );

  return (
    <CustomDialog
      title={$t({ defaultMessage: "Card details" })}
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      render={({ Body, Footer }) => (
        <>
          <Body>
            <Stack direction="column" spacing={3}>
              {cardDetailsSections
                .filter((section) => section.content?.length)
                .map((section, index) => (
                  <Box key={index}>
                    <Tag colorScheme="purple">
                      <TagLabel
                        fontWeight="bold"
                        fontFamily="Poppins"
                        textTransform="uppercase"
                      >
                        {section.header}
                      </TagLabel>
                    </Tag>
                    <Text my={2}>{section.content}</Text>
                  </Box>
                ))}
            </Stack>
          </Body>
          <Footer>
            <CustomButton colorScheme="purple" onClick={onClose}>
              {$t({ defaultMessage: "Done" })}
            </CustomButton>
          </Footer>
        </>
      )}
    />
  );
}
