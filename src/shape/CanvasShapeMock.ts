import { CanvasShape } from "~/shape/CanvasShape.ts";
import { vi } from "vitest";

export const canvasShapeMock: CanvasShape = {
  getSize: vi.fn(),
  zIndex: 0,
  name: "mockShape",
  update: vi.fn(),
  id: 'mockshapeId',
  deselect: vi.fn(),
  hideHighlight: vi.fn(),
  select: vi.fn(),
  serialize: vi.fn(),
  showHighlight: vi.fn(),
  getOrigin: vi.fn(),
  getImageData: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  createStyle: vi.fn(),
  clear: vi.fn()
};
