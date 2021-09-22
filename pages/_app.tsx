import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import React, { FC } from "react";
import "styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import dynamic from "next/dynamic";

const AuthProvider = dynamic(
  async () => (await import("contexts/auth")).AuthProvider,
  { ssr: false }
);

const queryClient = new QueryClient();

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
};

export default MyApp;
