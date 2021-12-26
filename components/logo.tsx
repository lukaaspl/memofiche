import { Heading, HeadingProps } from "@chakra-ui/react";

export default function Logo(headingProps: HeadingProps): JSX.Element {
  return (
    <Heading
      color="white"
      fontFamily="Poppins"
      fontSize="2xl"
      textAlign="center"
      {...headingProps}
    >
      MF
    </Heading>
  );
}
