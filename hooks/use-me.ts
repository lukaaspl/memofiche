import { ManageableConfig } from "domains/config";
import { MeUser } from "domains/user";
import { useCallback } from "react";
import { assert } from "utils/validation";
import useAuth from "./use-auth";

interface UseMe extends MeUser {
  isAdmin: boolean;
  updateConfig: (config: ManageableConfig) => void;
}

export default function useMe(): UseMe {
  const { authState, updateUser } = useAuth();

  assert(authState.user, "Hook needs user logged in to be used");

  const updateConfig = useCallback(
    (config: ManageableConfig) => updateUser({ config }),
    [updateUser]
  );

  const isAdmin = authState.user.role === "Admin";

  return { ...authState.user, isAdmin, updateConfig };
}
