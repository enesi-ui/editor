import { createStore } from "~/store/store.ts";
import { CanvasShape, Shape } from "~/shape/CanvasShape.ts";
import { selectionKeys, shapeKeys } from "~/api/key-factory.ts";
import { QueryObserver } from "@tanstack/react-query";
import queryClient from "~/api/query-client.ts";
import { CANVASID } from "~/canvas/useSelection.ts";
import { Selection } from "~/canvas/Selection.ts";

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
    set((store) => {
      const shapeObserver = new QueryObserver<Shape | null>(queryClient, {
        queryKey: shapeKeys.detail(shape.id),
        initialData: shape.serialize(),
      });
      shapeObserver.subscribe((result) => {
        if (!result || !result.data) return;
        store.find(shape.id)?.update(result.data);
      });

      const selectionObserver = new QueryObserver<Selection | null>(queryClient, {
        queryKey: selectionKeys.canvas(CANVASID),
      });
      selectionObserver.subscribe((result) => {
        if (!result || !result.data) return;
        if (result.data.shapeIds.includes(shape.id))
          store.find(shape.id)?.select();
        else store.find(shape.id)?.deselect();
      });

      return { ...store, data: [...store.data, shape] };
    });
  },
  clear: () => {
    set((store) => ({ ...store, data: [] }));
  },
}));

export { canvasShapeStore };
