import "./init";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebSocketContextProvider } from "~/web-sockets/WebSocketContextProvider.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const setupRoot = () => {
  const queryClient = new QueryClient();
  return ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <WebSocketContextProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </WebSocketContextProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
};
setupRoot();
