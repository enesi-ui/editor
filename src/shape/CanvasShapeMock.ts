import { CanvasShape } from "~/shape/CanvasShape.ts";
import { vi } from "vitest";

export const canvasShapeMock: CanvasShape = {
  id: 'mockshapeId',
  setFill: vi.fn(),
  setStrokes: vi.fn(),
  deselect: vi.fn(),
  hideHighlight: vi.fn(),
  select: vi.fn(),
  serialize: vi.fn(),
  showHighlight: vi.fn(),
  getOrigin: vi.fn(),
  setOrigin: vi.fn(),
  setSizeOrigin: vi.fn(),
  getImageData: vi.fn(),
  setSize: vi.fn(),
  getSize: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  createStyle: vi.fn(),
  clear: vi.fn()
};
