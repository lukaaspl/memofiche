import { useLocalStorage } from "beautiful-react-hooks";
import { ACCESS_TOKEN } from "consts/storage-keys";
import { Nullable } from "domains";
import {
  LoginUserRequestData,
  LoginUserResponse,
  MeResponse,
  MeUser,
  RegisterUserRequestData,
  RegisterUserResponse,
} from "domains/user";
import { apiClient, authApiClient } from "lib/axios";
import { createContext, useCallback, useEffect } from "react";
import { useImmer } from "use-immer";

export interface AuthContext {
  isUserLoading: boolean;
  isLogged: boolean;
  hasAccessToken: boolean;
  userData: UserData;
  signUp: (data: RegisterUserRequestData) => Promise<void>;
  signIn: (data: LoginUserRequestData) => Promise<void>;
  logOut: () => void;
}

const authContext = createContext<Nullable<AuthContext>>(null);

interface AuthProviderProps {
  children: JSX.Element;
}

interface UserData {
  data: Nullable<MeUser>;
  isLoading: boolean;
  hasError: boolean;
}

const userDataIdentity: UserData = {
  data: null,
  isLoading: true,
  hasError: false,
};

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [userData, updateUserData] = useImmer<UserData>(userDataIdentity);

  const [accessToken, setAccessToken] = useLocalStorage<Nullable<string>>(
    ACCESS_TOKEN,
    null
  );

  const isUserLoading = userData.isLoading;
  const isLogged = Boolean(userData.data);
  const hasAccessToken = Boolean(accessToken);

  const signUp = useCallback(
    async (data: RegisterUserRequestData) => {
      const response = await apiClient.post<RegisterUserResponse>(
        "/auth/register",
        {
          email: data.email,
          password: data.password,
          name: data.name,
        }
      );

      setAccessToken(() => response.data.token);
    },
    [setAccessToken]
  );

  const signIn = useCallback(
    async (data: LoginUserRequestData) => {
      const response = await apiClient.post<LoginUserResponse>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      setAccessToken(() => response.data.token);
    },
    [setAccessToken]
  );

  const logOut = useCallback(() => {
    updateUserData(userDataIdentity);
    setAccessToken(() => null);
  }, [setAccessToken, updateUserData]);

  const grantAccess = useCallback(async () => {
    if (!hasAccessToken) {
      updateUserData((draft) => {
        draft.isLoading = false;
      });

      return;
    }

    try {
      const { data } = await authApiClient.get<MeResponse>("/me");

      updateUserData((draft) => {
        draft.data = data;
        draft.isLoading = false;
      });
    } catch {
      updateUserData((draft) => {
        draft.isLoading = false;
        draft.hasError = true;
      });
    }
  }, [hasAccessToken, updateUserData]);

  useEffect(() => {
    grantAccess();
  }, [accessToken, grantAccess]);

  return (
    <authContext.Provider
      value={{
        isUserLoading,
        isLogged,
        hasAccessToken,
        userData,
        signUp,
        signIn,
        logOut,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export default authContext;
