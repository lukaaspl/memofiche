import {
  Avatar,
  Box,
  Flex,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  VStack,
} from "@chakra-ui/react";
import Span from "components/ui/span";
import useMe from "hooks/use-me";
import useProfileQuery from "hooks/use-profile-query";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";
import { MdExitToApp, MdPerson, MdSettings } from "react-icons/md";
import { getProfileAvatarSource } from "utils/profile";

interface TopBarMenuItem {
  label: string;
  icon: IconType;
  href: string;
}

const menuItems: TopBarMenuItem[] = [
  { label: "Manage your profile", icon: MdPerson, href: "/profile" },
  { label: "Settings", icon: MdSettings, href: "/settings" },
  { label: "Log out", icon: MdExitToApp, href: "/logout" },
];

export default function TopBar(): JSX.Element {
  const { name, email } = useMe();
  const { data: profile } = useProfileQuery();

  return (
    <Box position="fixed" right={3} top={4}>
      <Popover strategy="fixed" placement="bottom-end">
        <PopoverTrigger>
          <Avatar
            ignoreFallback
            name={name}
            src={getProfileAvatarSource(profile)}
            backgroundColor="purple.500"
            fontFamily="Poppins"
            fontWeight="bold"
            size="sm"
            cursor="pointer"
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent width="250px">
            <PopoverArrow />
            <PopoverHeader>
              <Flex>
                <Avatar
                  ignoreFallback
                  name={name}
                  src={getProfileAvatarSource(profile)}
                  backgroundColor="purple.500"
                  fontFamily="Poppins"
                  fontWeight="bold"
                  size="md"
                />
                <VStack spacing={0} align="flex-start" justify="center" ml={3}>
                  <Span
                    lineHeight="short"
                    fontWeight="bold"
                    fontFamily="Poppins"
                  >
                    {name}
                  </Span>
                  <Span fontSize="sm">{email}</Span>
                </VStack>
              </Flex>
            </PopoverHeader>
            <PopoverBody p={0}>
              <List py={2}>
                {menuItems.map((item, index) => (
                  <Link key={index} passHref href={item.href}>
                    <ListItem
                      d="flex"
                      px={2.5}
                      py={1}
                      alignItems="center"
                      cursor="pointer"
                      _hover={{ backgroundColor: "purple.50" }}
                    >
                      <ListIcon
                        as={item.icon}
                        color="purple.500"
                        fontSize="lg"
                      />
                      {item.label}
                    </ListItem>
                  </Link>
                ))}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
}
