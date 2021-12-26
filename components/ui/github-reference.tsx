import { chakra, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";

const REPOSITORY_HREF = "https://github.com/lukaaspl/memofiche";

const GithubIcon = chakra(RiGithubFill);

export default function GithubReference(): JSX.Element {
  return (
    <LinkBox position="fixed" right={3} bottom={4}>
      <LinkOverlay
        isExternal
        href={REPOSITORY_HREF}
        color="purple.500"
        _hover={{ color: "purple.600" }}
        transition="ease 0.15s"
      >
        <GithubIcon fontSize="4xl" />
      </LinkOverlay>
    </LinkBox>
  );
}
