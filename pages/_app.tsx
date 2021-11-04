import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React, { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "styles/globals.scss";

dayjs.extend(relativeTime);
dayjs.extend(duration);

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
    </QueryClientProvider>
  );
};

export default MyApp;
