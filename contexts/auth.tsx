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
import { createContext, useCallback, useEffect, useState } from "react";
import { assert } from "utils/validation";

export interface AuthContext {
  isUserLoading: boolean;
  isLogged: boolean;
  hasAccessToken: boolean;
  authState: AuthState;
  updateUser: (user: Partial<MeUser>) => void;
  signUp: (data: RegisterUserRequestData) => Promise<void>;
  signIn: (data: LoginUserRequestData) => Promise<void>;
  logOut: () => void;
}

const authContext = createContext<Nullable<AuthContext>>(null);

interface AuthProviderProps {
  children: JSX.Element;
}

interface AuthState {
  user: Nullable<MeUser>;
  isLoading: boolean;
  hasError: boolean;
}

const authStateIdentity: AuthState = {
  user: null,
  isLoading: true,
  hasError: false,
};

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [state, setState] = useState<AuthState>(authStateIdentity);

  const [accessToken, setAccessToken] = useLocalStorage<Nullable<string>>(
    ACCESS_TOKEN,
    null
  );

  const isUserLoading = state.isLoading;
  const isLogged = Boolean(state.user);
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
    setState(authStateIdentity);
    setAccessToken(() => null);
  }, [setAccessToken, setState]);

  const updateUser = useCallback((user: Partial<MeUser>) => {
    setState((prevState) => {
      assert(prevState.user);

      return {
        ...prevState,
        user: { ...prevState.user, ...user },
      };
    });
  }, []);

  const grantAccess = useCallback(async () => {
    if (!hasAccessToken) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return;
    }

    try {
      const { data } = await authApiClient.get<MeResponse>("/me");

      setState((prevState) => ({
        ...prevState,
        user: data,
        isLoading: false,
      }));
    } catch {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        hasError: true,
      }));
    }
  }, [hasAccessToken, setState]);

  useEffect(() => {
    grantAccess();
  }, [accessToken, grantAccess]);

  return (
    <authContext.Provider
      value={{
        isUserLoading,
        isLogged,
        hasAccessToken,
        authState: state,
        updateUser,
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
