import {
  Code,
  Divider,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import useCommonPalette from "hooks/use-common-palette";
import { LegacyRef } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const BASE_Y_OFFSET = 3;

const customComponents: Components = {
  p: (props) => <Text mb={BASE_Y_OFFSET} {...props} />,
  h1: (props) => <Heading mb={BASE_Y_OFFSET} fontSize="2xl" {...props} />,
  h2: (props) => <Heading mb={BASE_Y_OFFSET} fontSize="xl" {...props} />,
  h3: (props) => <Heading mb={BASE_Y_OFFSET} fontSize="large" {...props} />,
  h4: (props) => <Heading mb={BASE_Y_OFFSET} fontSize="md" {...props} />,
  h5: (props) => <Heading mb={BASE_Y_OFFSET} fontSize="sm" {...props} />,
  h6: (props) => <Heading mb={BASE_Y_OFFSET} fontSize="xs" {...props} />,
  blockquote: ({ ref, ...props }) => (
    <Text
      as="blockquote"
      mb={BASE_Y_OFFSET}
      fontStyle="italic"
      ref={ref as LegacyRef<HTMLParagraphElement>}
      {...props}
    />
  ),
  ul: (props) => <UnorderedList mb={BASE_Y_OFFSET} {...props} />,
  ol: (props) => <OrderedList mb={BASE_Y_OFFSET} {...props} />,
  li: (props) => <ListItem mb={1} {...props} />,
  hr: (props) => <Divider mb={BASE_Y_OFFSET} {...props} />,
  table: (props) => (
    <TableContainer>
      <Table size="sm" mb={BASE_Y_OFFSET} {...props} />
    </TableContainer>
  ),
  tbody: Tbody,
  thead: Thead,
  // @ts-ignore
  th: Th,
  // @ts-ignore
  td: Td,
  tr: Tr,
  a: function A(props) {
    return <Link isExternal color={useCommonPalette().primary} {...props} />;
  },
  img: Image,
  code: Code,
};

interface MarkdownProps {
  children: string;
  className?: string;
}

export default function Markdown({
  children,
  className,
}: MarkdownProps): JSX.Element {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={customComponents}
      className={className}
    >
      {children}
    </ReactMarkdown>
  );
}
