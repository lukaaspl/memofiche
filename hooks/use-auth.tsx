import authContext, { AuthContext } from "contexts/auth";
import { useContext } from "react";

export default function useAuth(): AuthContext {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("Auth provider is required");
  }

  return context;
}
