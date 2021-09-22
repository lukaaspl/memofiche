import { Box, Button, Stack, Tag, TagLabel, Text } from "@chakra-ui/react";
import CustomDialog from "components/ui/custom-dialog";
import { DetailedCard } from "domains/card";
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
  const cardDetailsSections = useMemo(
    () => [
      { header: "Obverse", content: card.obverse },
      { header: "Reverse", content: card.reverse },
      { header: "Type", content: card.type },
      { header: "Tags", content: TagsConverter.toString(card.tags) },
      {
        header: "Creation date",
        content: new Date(card.createdAt).toLocaleString(),
      },
      {
        header: "Last modification date",
        content: new Date(card.updatedAt).toLocaleString(),
      },
    ],
    [card]
  );

  return (
    <CustomDialog
      title="Card details"
      isOpen={isOpen}
      onClose={onClose}
      render={({ Body, Footer }) => (
        <>
          <Body>
            <Stack direction="column" spacing={3}>
              {cardDetailsSections.map((section, index) => (
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
            <Button colorScheme="purple" onClick={onClose}>
              Done
            </Button>
          </Footer>
        </>
      )}
    />
  );
}
