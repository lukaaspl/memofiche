import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Textarea,
  TextareaProps,
  Tooltip,
} from "@chakra-ui/react";
import { omit } from "@chakra-ui/utils";
import Markdown from "components/shared/markdown";
import useTranslation from "hooks/use-translation";
import useTypedColorModeValue from "hooks/use-typed-color-mode-value";
import { forwardRef, useRef, useState } from "react";
import { IconType } from "react-icons";
import {
  BiBold,
  BiCode,
  BiHeading,
  BiItalic,
  BiStrikethrough,
} from "react-icons/bi";
import { defineMessage, MessageDescriptor } from "react-intl";
import { assignRefs } from "utils/assign-refs";

interface Tag {
  icon: IconType;
  descriptor: MessageDescriptor;
  prefix: string;
  postfix: string;
  key?: string;
}

type TagName = "header" | "bold" | "italic" | "strike" | "code";

const TAGS: Record<TagName, Tag> = {
  header: {
    icon: BiHeading,
    descriptor: defineMessage({
      defaultMessage: "Heading",
    }),
    prefix: "### ",
    postfix: "",
  },
  bold: {
    icon: BiBold,
    descriptor: defineMessage({
      defaultMessage: "Bold",
    }),
    key: "b",
    prefix: "**",
    postfix: "**",
  },
  italic: {
    icon: BiItalic,
    descriptor: defineMessage({
      defaultMessage: "Italic",
    }),
    key: "i",
    prefix: "_",
    postfix: "_",
  },
  strike: {
    icon: BiStrikethrough,
    descriptor: defineMessage({
      defaultMessage: "Strike",
    }),
    prefix: "~",
    postfix: "~",
  },
  code: {
    icon: BiCode,
    descriptor: defineMessage({
      defaultMessage: "Code",
    }),
    key: "e",
    prefix: "`",
    postfix: "`",
  },
} as const;

const keyToTagNameMap = Object.entries(TAGS).reduce<Record<string, TagName>>(
  (acc, [tagName, tag]) => {
    if (tag.key) {
      acc[tag.key] = tagName as TagName;
    }
    return acc;
  },
  {}
);

const insertText = (text: string): void => {
  document.execCommand("insertText", false, text);
};

interface RichEditorProps extends TextareaProps {
  label?: React.ReactNode;
}

const RichEditor = forwardRef<HTMLTextAreaElement, RichEditorProps>(
  ({ label, ...textareaProps }, forwardedRef) => {
    const [isPreview, setIsPreview] = useState(false);
    const [textareaSize, setTextareaSize] = useState({ width: 0, height: 0 });
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const { $t } = useTranslation();

    const togglePreview = (): void => {
      if (!isPreview && internalRef.current) {
        setTextareaSize({
          width: internalRef.current.offsetWidth,
          height: internalRef.current.offsetHeight,
        });
      }

      setIsPreview((s) => !s);
    };

    const toggleTag = (tag: Tag): void => {
      if (!internalRef.current) {
        return;
      }

      const textareaEl = internalRef.current;

      const [text, start, end] = [
        textareaEl.value,
        textareaEl.selectionStart,
        textareaEl.selectionEnd,
      ];

      const selectedText = text.substring(start, end);

      textareaEl.focus();

      // case 1: content with tags has been selected
      const isTextWithTagsSelected =
        selectedText.startsWith(tag.prefix) &&
        selectedText.endsWith(tag.postfix);

      if (isTextWithTagsSelected) {
        const stripedText = selectedText.substring(
          tag.prefix.length,
          selectedText.length - tag.postfix.length
        );

        insertText(stripedText);

        textareaEl.setSelectionRange(
          start,
          end - (tag.prefix.length + tag.postfix.length)
        );

        return;
      }

      // case 2: content within tags has been selected
      const textPrefix = text.substring(start - tag.prefix.length, start);
      const textPostfix = text.substring(end, end + tag.postfix.length);
      const isTextWithinTagsSelected =
        textPrefix === tag.prefix && textPostfix === tag.postfix;

      if (isTextWithinTagsSelected) {
        textareaEl.setSelectionRange(
          start - tag.prefix.length,
          end + tag.postfix.length
        );

        insertText(selectedText);

        textareaEl.setSelectionRange(
          start - tag.prefix.length,
          end - tag.prefix.length
        );

        return;
      }

      // case 3: text to be tagged has been selected
      insertText([tag.prefix, selectedText, tag.postfix].join(""));

      textareaEl.setSelectionRange(
        start + tag.prefix.length,
        end + tag.prefix.length
      );
    };

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ): void => {
      textareaProps.onKeyDown?.(event);

      if (event.metaKey) {
        const tagName = keyToTagNameMap[event.key.toLowerCase()];

        if (tagName) {
          toggleTag(TAGS[tagName]);
        }
      }
    };

    return (
      <Box>
        <Box
          display="flex"
          justifyContent={label ? "space-between" : "flex-end"}
          alignItems="flex-end"
        >
          {label}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
              borderBottom="none"
              isActive={isPreview}
              onClick={togglePreview}
            >
              Preview
            </Button>
            {Object.entries(TAGS).map(([tagName, tag]) => (
              <Tooltip
                key={tagName}
                label={`${$t(tag.descriptor)}${
                  tag.key ? ` (⌘${tag.key.toUpperCase()})` : ""
                }`}
                placement="top"
                openDelay={500}
              >
                <IconButton
                  borderBottom="none"
                  isDisabled={isPreview}
                  aria-label={$t(tag.descriptor)}
                  icon={<tag.icon />}
                  onClick={() => toggleTag(tag)}
                />
              </Tooltip>
            ))}
          </ButtonGroup>
        </Box>
        <Textarea
          display={isPreview ? "none" : "initial"}
          ref={assignRefs([internalRef, forwardedRef])}
          onKeyDown={handleKeyDown}
          {...omit(textareaProps, ["onKeyDown"])}
        />
        <Box
          display={isPreview ? "block" : "none"}
          py="2"
          px="4"
          borderWidth="1px"
          borderRadius="md"
          borderColor={useTypedColorModeValue("color")(
            "gray.200",
            "whiteAlpha.300"
          )}
          fontSize="md"
          lineHeight="short"
          width={`${textareaSize.width}px`}
          height={`${textareaSize.height}px`}
          overflow="auto"
          as={Markdown}
        >
          {internalRef.current?.value || ""}
        </Box>
      </Box>
    );
  }
);

RichEditor.displayName = "RichEditor";

export default RichEditor;
