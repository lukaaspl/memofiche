import {
  Avatar,
  Box,
  BoxProps,
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
import { Locale } from "consts/locales";
import useCommonPalette from "hooks/use-common-palette";
import useIntlConfig from "hooks/use-intl-config";
import useMe from "hooks/use-me";
import useProfileQuery from "hooks/use-profile-query";
import useTranslation from "hooks/use-translation";
import useTypedColorModeValue from "hooks/use-typed-color-mode-value";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { IconType } from "react-icons";
import { MdExitToApp, MdLanguage, MdPerson, MdSettings } from "react-icons/md";
import { getProfileAvatarSource } from "utils/profile";

type UserPanelMenuItem = {
  label: string;
  icon: IconType;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
};

export default function FloatingUserPanel(boxProps: BoxProps): JSX.Element {
  const { name, email } = useMe();
  const { locale, onLocaleChange } = useIntlConfig();
  const { $t } = useTranslation();
  const { data: profile } = useProfileQuery();
  const palette = useCommonPalette();

  const menuItemHoverBgColor = useTypedColorModeValue("backgroundColor")(
    "purple.50",
    "gray.600"
  );

  const handleLanguageSwitch = useCallback(() => {
    onLocaleChange(locale === Locale.EN ? Locale.PL : Locale.EN);
  }, [locale, onLocaleChange]);

  const menuItems: UserPanelMenuItem[] = useMemo(
    () => [
      {
        label: $t({ defaultMessage: "Manage your profile" }),
        icon: MdPerson,
        href: "/profile",
      },
      {
        label: $t(
          { defaultMessage: "Language: {locale}" },
          { locale: locale.toUpperCase() }
        ),
        icon: MdLanguage,
        onClick: handleLanguageSwitch,
      },
      {
        label: $t({ defaultMessage: "Settings" }),
        icon: MdSettings,
        href: "/settings",
      },
      {
        label: $t({ defaultMessage: "Log out" }),
        icon: MdExitToApp,
        href: "/logout",
      },
    ],
    [$t, handleLanguageSwitch, locale]
  );

  return (
    <Box {...boxProps}>
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
                {menuItems.map((item, index) => {
                  const listItemMarkup = (
                    <ListItem
                      d="flex"
                      px={2.5}
                      py={1}
                      alignItems="center"
                      cursor="pointer"
                      userSelect="none"
                      _hover={{ backgroundColor: menuItemHoverBgColor }}
                      onClick={item.onClick}
                    >
                      <ListIcon
                        as={item.icon}
                        color={palette.primary}
                        fontSize="lg"
                      />
                      {item.label}
                    </ListItem>
                  );

                  return item.href ? (
                    <Link key={index} passHref href={item.href}>
                      {listItemMarkup}
                    </Link>
                  ) : (
                    <React.Fragment key={index}>
                      {listItemMarkup}
                    </React.Fragment>
                  );
                })}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
}
