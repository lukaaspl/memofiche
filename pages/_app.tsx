import { ChakraProvider } from "@chakra-ui/react";
import GithubReference from "components/ui/github-reference";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React, { FC } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "styles/globals.scss";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isToday);
dayjs.extend(localizedFormat);

const AuthProvider = dynamic(
  async () => (await import("contexts/auth")).AuthProvider,
  { ssr: false }
);

const EnhancedIntlProvider = dynamic(
  async () => (await import("contexts/enhanced-intl")).EnhancedIntlProvider,
  { ssr: false }
);

const queryClient = new QueryClient();

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <EnhancedIntlProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChakraProvider>
            <Component {...pageProps} />
            <GithubReference />
          </ChakraProvider>
        </AuthProvider>
      </QueryClientProvider>
    </EnhancedIntlProvider>
  );
};

export default MyApp;
