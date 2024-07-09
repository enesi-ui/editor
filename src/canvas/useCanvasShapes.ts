import { useEffect } from "react";
import { Rectangle } from "~/shape/Rectangle.ts";
import { usePixi } from "~/pixi/pixiContext.ts";
import { useShapes } from "~/shape/useShapes.ts";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";
import { useSelection } from "~/canvas/useSelection.ts";
import { canvasShapeStore } from "~/canvas/CanvasShapeStore.ts";

export const useCanvasShapes = (canvasId: string) => {
  const store = canvasShapeStore();
  const { update } = useShapeUpdate();
  const { shapes } = useShapes(canvasId);

  const { deselectAllSelect } = useSelection(canvasId);

  const app = usePixi();

  useEffect(() => {
    if (!shapes) return;
    shapes.map((shape) => {
      const existing = store.current.find(shape.id);
      if (existing) return;

      // if shape does not exist, create it (coming from server)
      if (shape.type === "RECTANGLE") {
        store.current.add(
          new Rectangle(shape.container, app, shape, {
            onSelect: deselectAllSelect,
            onUpdate: update,
          }),
        );
      } else if (shape.type === "ELLIPSE") {
        console.error("ellipse not fully implemented");
      } else {
        console.error("unknown shape type");
      }
    });
  }, [store, deselectAllSelect, update, app, shapes]);
};
