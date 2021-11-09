import { Text, TextProps } from "@chakra-ui/layout";

export default function Span(props: TextProps): JSX.Element {
  return <Text as="span" {...props} />;
}
