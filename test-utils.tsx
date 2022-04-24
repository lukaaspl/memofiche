import { ChakraProvider } from "@chakra-ui/react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import messages from "compiled-lang/en.json";
import { AuthProvider } from "contexts/auth";
import { EnhancedIntlProvider } from "contexts/enhanced-intl";
import "dayjs/locale/en.js";
import { setupServer, SetupServerApi } from "msw/node";
import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { QueryClient, QueryClientProvider } from "react-query";

export const setupMockSever = (
  ...handlers: Parameters<typeof setupServer>
): SetupServerApi => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  return server;
};

const scheduler =
  typeof setImmediate === "function" ? setImmediate : setTimeout;

export const flushPromises = (): Promise<void> =>
  new Promise((resolve) => scheduler(resolve));

const Wrapper: React.FC = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <EnhancedIntlProvider fixedMessages={messages}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </AuthProvider>
      </QueryClientProvider>
    </EnhancedIntlProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => {
  return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
