import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useEffect, useRef } from "react";
import { Rectangle } from "~/shape/Rectangle.ts";
import { usePixi } from "~/pixi/pixiContext.ts";
import { useShapes } from "~/shape/useShapes.ts";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";
import { useSelection } from "~/canvas/useSelection.ts";

// NOTE: should only be used once in the app, since it renders to canvas
export const useCanvasShapes = () => {
  const canvasShapes = useRef<CanvasShape[]>([]);
  const { update } = useShapeUpdate();
  const { shapes } = useShapes();

  const { selectedShapes, deselectAllSelect } = useSelection();

  const app = usePixi();

  useEffect(() => {
    if (!shapes) return;
    shapes.map((shape) => {
      const existing = canvasShapes.current.find(
        (canvasShape) => canvasShape.id === shape.id,
      );
      if (existing) {
        existing.update(shape);
        if (!selectedShapes?.some((selected) => selected === existing.id)) {
          existing.deselect();
        } else {
          existing.select();
        }
        return;
      }
      // if shape does not exist, create it (coming from server)
      if (shape.type === "RECTANGLE") {
        canvasShapes.current.push(
          new Rectangle(shape.container, app, {
            onSelect: deselectAllSelect,
            onUpdate: update,
            data: shape,
          }),
        );
      } else if (shape.type === "ELLIPSE") {
        console.error("ellipse not fully implemented");
      } else {
        console.error("unknown shape type");
      }
    });
  }, [selectedShapes, deselectAllSelect, update, app, shapes]);
  return { canvasShapes };
};
