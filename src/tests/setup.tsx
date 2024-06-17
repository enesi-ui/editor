import {
  renderHook,
  render,
  RenderOptions,
  fireEvent,
} from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebSocketContextProvider } from "~/web-sockets/WebSocketContextProvider.tsx";
import WS from "vitest-websocket-mock";

const queryClient = new QueryClient();
const WithProviders = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketContextProvider>{children}</WebSocketContextProvider>
    </QueryClientProvider>
  );
};

const setupHook = <Props, Results>(hook: (props: Props) => Results) => {
  const server = new WS(
    import.meta.env.VITE_APP_WS_URL || "ws://localhost:8082",
  );
  return {
    server,
    ...renderHook(hook, { wrapper: WithProviders }),
  };
};

const setup = (ui: ReactElement, options?: Omit<RenderOptions, "queries">) => {
  return { user: userEvent.setup(), ...render(ui, options) };
};

export { setup, fireEvent, setupHook };
