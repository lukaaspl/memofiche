import axios from "axios";
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
import { useImmer } from "use-immer";
import { createContext, useCallback, useContext } from "react";
import { useEffect } from "react";

interface AuthContext {
  isLogged: boolean;
  userData: UserData;
  signUp: (data: RegisterUserRequestData) => Promise<void>;
  signIn: (data: LoginUserRequestData) => Promise<void>;
  logOut: () => void;
}

const signFnPlaceholder = (): Promise<void> => Promise.resolve();

const authContext = createContext<AuthContext>({
  isLogged: false,
  userData: { data: null, loading: true },
  signUp: signFnPlaceholder,
  signIn: signFnPlaceholder,
  logOut: () => void 0,
});

interface AuthProviderProps {
  children: JSX.Element;
}

type UserData =
  | {
      loading: true;
      data: null;
    }
  | {
      loading: false;
      data: MeUser;
    };

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [userData, updateUserData] = useImmer<UserData>({
    data: null,
    loading: true,
  });

  const [accessToken, setAccessToken] = useLocalStorage<Nullable<string>>(
    ACCESS_TOKEN,
    null
  );

  const isLogged = Boolean(accessToken);

  const signUp = useCallback(
    async (data: RegisterUserRequestData) => {
      const response = await axios.post<RegisterUserResponse>(
        "/api/auth/register",
        { email: data.email, password: data.password, name: data.name }
      );

      setAccessToken(() => response.data.token);
    },
    [setAccessToken]
  );

  const signIn = useCallback(
    async (data: LoginUserRequestData) => {
      const response = await axios.post<LoginUserResponse>("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      setAccessToken(() => response.data.token);
    },
    [setAccessToken]
  );

  const getMe = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const response = await axios.get<MeResponse>("/api/me", {
      headers: { authorization: accessToken },
    });

    updateUserData((draft) => {
      draft.data = response.data;
      draft.loading = false;
    });
  }, [accessToken, updateUserData]);

  const logOut = useCallback(() => {
    setAccessToken(() => null);
  }, [setAccessToken]);

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <authContext.Provider
      value={{
        isLogged,
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

export default function useAuth(): AuthContext {
  return useContext(authContext);
}
