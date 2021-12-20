import { Center, chakra, Text } from "@chakra-ui/react";
import Markdown from "components/markdown";
import { Nullable } from "domains";
import { CardMeta } from "domains/card";
import useTranslation from "hooks/use-translation";
import React, { useMemo } from "react";
import { MdNote, MdRepeat } from "react-icons/md";
import CardMarks, { CardMark } from "./card-marks";
import CardOrnament from "./card-ornament";
import CardPauseCover from "./card-pause-cover";

interface CardSideProps {
  content: string;
  note: Nullable<string>;
  meta: CardMeta;
  isPaused: boolean;
  reversed?: boolean;
}

const RepeatIcon = chakra(MdRepeat);
const NoteIcon = chakra(MdNote);

export default function CardSide({
  content,
  note,
  meta,
  isPaused,
  reversed = false,
}: CardSideProps): JSX.Element {
  const { $t } = useTranslation();

  const isReversed = reversed;

  const marks = useMemo<CardMark[]>(
    () => [
      {
        icon: NoteIcon,
        bgColor: "blue",
        color: "white",
        label: $t({ defaultMessage: "Note: {note}" }, { note: note || "" }),
        isVisible: Boolean(note),
      },
      {
        icon: RepeatIcon,
        bgColor: "purple",
        color: "white",
        label: $t({ defaultMessage: "Card sides were reversed" }),
        isVisible: meta.isSwapped,
      },
    ],
    [meta.isSwapped, note, $t]
  );

  const labels = {
    reverse: $t({ defaultMessage: "Reverse" }),
    obverse: $t({ defaultMessage: "Obverse" }),
  };

  return (
    <Center
      position="absolute"
      width="100%"
      height="100%"
      boxShadow="lg"
      sx={{ backfaceVisibility: "hidden" }}
      backgroundColor="transparent"
      transform={isReversed ? "rotateX(180deg)" : undefined}
      overflow="hidden"
    >
      <CardPauseCover isPaused={isPaused} />
      <CardOrnament
        position="top-left"
        text={isReversed ? labels.reverse : labels.obverse}
      />
      <CardOrnament
        position="bottom-right"
        text={isReversed ? labels.reverse : labels.obverse}
      />
      <CardMarks marks={marks} />
      <Center height="75%">
        <Text
          className="primary-sc"
          fontFamily="Poppins"
          fontSize="lg"
          wordBreak="break-word"
          overflow="auto"
          maxHeight="100%"
          paddingX={3}
          textAlign="center"
        >
          <Markdown>{content}</Markdown>
        </Text>
      </Center>
    </Center>
  );
}
