import {
  Box,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import Feedback from "components/ui/feedback";
import useCommonPalette from "hooks/use-common-palette";
import useMe from "hooks/use-me";
import useProfileQuery from "hooks/use-profile-query";
import useSimpleDisclosure from "hooks/use-simple-disclosure";
import React, { useMemo } from "react";
import { MdEdit, MdEmail, MdInsertLink, MdPerson } from "react-icons/md";
import EditProfileDialog from "./edit-profile-dialog";
import ProfileDetailsAvatar from "./profile-details-avatar";

export default function ProfileDetails(): JSX.Element {
  const user = useMe();
  const { data: profile, isLoading, error } = useProfileQuery();
  const palette = useCommonPalette();

  const [
    isEditProfileDialogOpen,
    onEditProfileDialogOpen,
    onEditProfileDialogClose,
  ] = useSimpleDisclosure();

  const availableDetailsListItems = useMemo(
    () =>
      [
        { Icon: MdPerson, value: user.name },
        { Icon: MdEmail, value: user.email },
        { Icon: MdInsertLink, value: profile?.website },
      ].filter((item) => Boolean(item.value)),
    [user, profile]
  );

  if (error) {
    return <Feedback type="error" />;
  }

  if (!profile || isLoading) {
    return <Feedback type="loading" />;
  }

  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Flex
      position="relative"
      boxShadow={palette.containerShadow}
      mt={16}
      px={5}
      py={10}
    >
      <ProfileDetailsAvatar avatar={profile.avatar} />
      <Box pl={8}>
        {fullName.length > 0 && (
          <Heading fontFamily="Poppins" size="2xl" letterSpacing="1px">
            {fullName}
          </Heading>
        )}
        <List spacing={2} mt={4}>
          {availableDetailsListItems.map((item, index) => (
            <ListItem key={index}>
              <Heading
                letterSpacing="0.5px"
                fontFamily="Poppins"
                size="sm"
                color="purple.500"
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <item.Icon size={21} />
                  <span>{item.value}</span>
                </Stack>
              </Heading>
            </ListItem>
          ))}
        </List>
        {profile.bio && (
          <Text mt={6} fontSize="md" fontStyle="italic" maxWidth="500px">
            {profile.bio}
          </Text>
        )}
      </Box>
      <IconButton
        position="absolute"
        right={3}
        top={3}
        aria-label="Edit profile"
        size="md"
        icon={<MdEdit size={20} />}
        mr={2}
        onClick={onEditProfileDialogOpen}
      />
      <EditProfileDialog
        profile={profile}
        isOpen={isEditProfileDialogOpen}
        onClose={onEditProfileDialogClose}
      />
    </Flex>
  );
}