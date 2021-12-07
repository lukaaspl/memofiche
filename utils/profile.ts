import { DetailedProfile } from "domains/user";

export function getProfileAvatarSource(
  profile?: DetailedProfile
): string | undefined {
  return profile?.avatar?.source
    ? `data:image/png;base64,${profile.avatar.source}`
    : undefined;
}
