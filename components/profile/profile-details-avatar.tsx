import {
  Alert,
  AlertIcon,
  Box,
  ButtonProps,
  Center,
  chakra,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Theme,
  useTheme,
} from "@chakra-ui/react";
import { Avatar } from "@prisma/client";
import { PROFILE_QUERY_KEY } from "consts/query-keys";
import { Nullable } from "domains";
import useStatus from "hooks/use-status";
import useSuccessToast from "hooks/use-success-toast";
import { authApiClient } from "lib/axios";
import Image from "next/image";
import React, { useRef } from "react";
import { MdAddAPhoto, MdDelete, MdMoreVert, MdPerson } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";

const AddAvatarIcon = chakra(MdAddAPhoto);
const AvatarPlaceholderIcon = chakra(MdPerson);
const MoreIcon = chakra(MdMoreVert);

async function updateAvatarSource(source: Nullable<string>): Promise<Avatar> {
  const { data: avatar } = await authApiClient.put<Avatar>("/profile/avatar", {
    source,
  });

  return avatar;
}

interface ProfileDetailsAvatarProps {
  avatar: Nullable<Avatar>;
}

export default function ProfileDetailsAvatar({
  avatar,
}: ProfileDetailsAvatarProps): JSX.Element {
  const { colors } = useTheme<Theme>();
  const fileInputRef = useRef<Nullable<HTMLInputElement>>(null);
  const queryClient = useQueryClient();
  const toast = useSuccessToast();
  const { status: fileUploadStatus, setStatus: setFileUploadStatus } =
    useStatus();

  const updateAvatarSourceMutation = useMutation(updateAvatarSource, {
    onSuccess: () => {
      queryClient.invalidateQueries(PROFILE_QUERY_KEY);
      toast("Avatar has been updated successfully");
    },
  });

  const onAvatarFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const uploadedFile = event.target.files?.[0];
    const allowedFileTypes = ["image/jpeg", "image/png"];
    const maxSizeBytes = 1024 * 1024;

    if (!uploadedFile) {
      return;
    }

    if (
      !allowedFileTypes.includes(uploadedFile.type) ||
      uploadedFile.size > maxSizeBytes
    ) {
      setFileUploadStatus("error");
      return;
    }

    const reader = new FileReader();

    reader.readAsBinaryString(uploadedFile);

    reader.onloadstart = () => {
      setFileUploadStatus("loading");
    };

    reader.onerror = () => {
      setFileUploadStatus("error");
    };

    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== "string") {
        setFileUploadStatus("error");
        return;
      }

      const sourceBase64 = btoa(event.target.result);
      updateAvatarSourceMutation.mutate(sourceBase64);
      setFileUploadStatus("success");
    };
  };

  const hasAvatar = typeof avatar?.source === "string";

  const iconButtonProps: ButtonProps = {
    right: 0,
    bottom: 0,
    transform: "translateY(-50%)",
    size: "md",
    colorScheme: "purple",
    borderRadius: "50%",
    position: "absolute",
    isLoading:
      updateAvatarSourceMutation.isLoading || fileUploadStatus === "loading",
  };

  return (
    <Box borderRight="2px solid" borderColor="gray.200" pr={8}>
      <Center
        position="relative"
        width="220px"
        height="220px"
        boxShadow={`0 0 0 3px ${colors.purple[500]}`}
        borderRadius="50%"
        backgroundColor="purple.50"
      >
        {hasAvatar ? (
          <Box width="100%" height="100%" overflow="hidden" borderRadius="50%">
            <Image
              width={220}
              height={220}
              src={`data:image/png;base64,${avatar.source}`}
            />
          </Box>
        ) : (
          <AvatarPlaceholderIcon color="purple.500" size={100} />
        )}
        {hasAvatar ? (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MoreIcon />}
              aria-label="Avatar actions"
              {...iconButtonProps}
            />
            <MenuList>
              <MenuItem
                icon={<MdAddAPhoto size={18} />}
                onClick={() => fileInputRef.current?.click()}
              >
                Update avatar
              </MenuItem>
              <MenuItem
                color="red.500"
                icon={<MdDelete size={18} />}
                onClick={() =>
                  updateAvatarSourceMutation.mutate(null, {
                    onSuccess: () => {
                      if (fileInputRef.current?.value) {
                        fileInputRef.current.value = "";
                      }
                    },
                  })
                }
              >
                Remove avatar
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <IconButton
            icon={<AddAvatarIcon />}
            aria-label="Add avatar"
            onClick={() => fileInputRef.current?.click()}
            {...iconButtonProps}
          />
        )}
        <chakra.input
          ref={fileInputRef}
          type="file"
          display="none"
          onChange={onAvatarFileChange}
        />
      </Center>
      <List mt={3} textAlign="center" fontSize="11px">
        <ListItem>
          Max. size: <b>1 MB</b>
        </ListItem>
        <ListItem>
          Allowed files: <b>jpg/png</b>
        </ListItem>
      </List>
      {fileUploadStatus === "error" && (
        <Alert status="error" mt={2} padding="8px" borderRadius="sm">
          <AlertIcon />
          The file is invalid
        </Alert>
      )}
    </Box>
  );
}
