import { createStore } from "~/store/store.ts";
import { describe, expect, it } from "vitest";
import { Rectangle } from "~/shape/Rectangle.ts";
import { Application } from "pixi.js";
import { Shape } from "~/shape/CanvasShape.ts";

const data: Shape = {
  canvasId: "",
  container: { height: 0, width: 0, x: 0, y: 0 },
  fills: [],
  graphics: { height: 0, width: 0, x: 0, y: 0 },
  radius: 0,
  strokes: [],
  zIndex: 0,
  id: "id",
  name: "Rectangle",
  type: "RECTANGLE",
};

describe("store", () => {
  describe("createStore - simple count", () => {
    interface CountStore {
      count: number;
      increment: () => void;
      decrement: () => void;
    }
    const useCountStore = createStore<CountStore>((set) => ({
      count: 0,
      increment: () => {
        set((store) => {
          return { ...store, count: store.count + 1 };
        });
      },
      decrement: () => set((store) => ({ ...store, count: store.count - 1 })),
    }));

    it("should increment count", () => {
      const store = useCountStore();
      store.current.increment();
      expect(store.current.count).toEqual(1);
      const newStore = useCountStore();
      expect(newStore.current.count).toEqual(1);
    });
  });

  describe("createStore - Rectangle", () => {
    interface RectangleStore {
      rectangles: Rectangle[];
      addRectangle: (rectangle: Rectangle) => void;
      removeRectangle: (id: string) => void;
    }
    const store = createStore<RectangleStore>((set) => ({
      rectangles: [],
      addRectangle: (rectangle) => {
        set((store) => {
          return { ...store, rectangles: [...store.rectangles, rectangle] };
        });
      },
      removeRectangle: (id) => {
        set((store) => {
          return {
            ...store,
            rectangles: store.rectangles.filter((r) => r.id !== id),
          };
        });
      },
    }));
    it("should add rectangle", () => {
      const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
      const storeRef = store();
      storeRef.current.addRectangle(rectangle);
      expect(storeRef.current.rectangles.length).toEqual(1);
    });
  });
});
