import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./server.ts";

beforeAll(() => server.listen({ onUnhandledRequest: "error"}));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
