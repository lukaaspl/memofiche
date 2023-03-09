import { chakra, LinkBox, LinkOverlay } from "@chakra-ui/react";
import useCommonPalette from "hooks/use-common-palette";
import { RiGithubFill } from "react-icons/ri";

const REPOSITORY_HREF = "https://github.com/lukaaspl/memofiche";

const GithubIcon = chakra(RiGithubFill);

export default function GithubReference(): JSX.Element {
  const { primary, primaryDark } = useCommonPalette();

  return (
    <LinkBox position="fixed" right={3} bottom={4}>
      <LinkOverlay
        isExternal
        href={REPOSITORY_HREF}
        color={primary}
        _hover={{ color: primaryDark }}
        transition="ease 0.15s"
      >
        <GithubIcon fontSize="4xl" />
      </LinkOverlay>
    </LinkBox>
  );
}
