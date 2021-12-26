import { Text, TextProps } from "@chakra-ui/layout";
import { forwardRef } from "react";

const Span = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => (
  <Text as="span" ref={ref} {...props} />
));

Span.displayName = "Span";

export default Span;
