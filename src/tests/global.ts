import "./vitest-canvas-patch";
import { setupJestCanvasMock } from "jest-webgl-canvas-mock";
import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";
import "jest-webgl-canvas-mock";


beforeEach(() => {
  setupJestCanvasMock();
});
