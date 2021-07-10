import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import React, { FC } from "react";
import "styles/globals.css";
import dynamic from "next/dynamic";

const AuthProvider = dynamic(
  async () => (await import("hooks/use-auth")).AuthProvider,
  { ssr: false }
);

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
};

export default MyApp;
