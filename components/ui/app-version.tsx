import { Text, TextProps } from "@chakra-ui/react";

export default function AppVersion(props: TextProps): JSX.Element {
  return (
    <Text fontSize="x-small" color="white" fontFamily="Poppins" {...props}>
      v{process.env.APP_VERSION}
    </Text>
  );
}
