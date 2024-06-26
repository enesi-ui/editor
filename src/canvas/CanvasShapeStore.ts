import { createStore } from "~/store/store.ts";
import { CanvasShape } from "~/shape/CanvasShape.ts";

export interface CanvasShapeStore {
  data: CanvasShape[];
  add: (shape: CanvasShape) => void;
  find: (id: string) => CanvasShape | undefined;
  clear: () => void;
}

const canvasShapeStore = createStore<CanvasShapeStore>((set, get) => ({
  data: [],
  find: (id) => {
    return get().data.find((shape) => shape.id === id);
  },
  add: (shape) => {
    set((store) => ({ ...store, data: [...store.data, shape] }));
  },
  clear: () => {
    set((store) => ({ ...store, data: [] }));
  },
}));

export { canvasShapeStore };
