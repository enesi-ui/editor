import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useEffect, useRef, useState } from "react";
import { Rectangle } from "~/shape/Rectangle.ts";
import { usePixi } from "~/pixi/pixiContext.ts";
import { useShapes } from "~/shape/useShapes.ts";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";
import { CanvasObject } from "~/canvas/CanvasObject.ts";
import notEmpty from "~/utility/notEmpty.ts";

// todo unit test
export const useCanvasShapes = () => {
  const canvasShapes = useRef<CanvasShape[]>([]);
  const { update } = useShapeUpdate();
  const { shapes } = useShapes();

  const app = usePixi();
  const [currentObject, setCurrentObject] = useState<CanvasObject | null>(null);

  const handleObjectSelect = (object: CanvasObject | null) => {
    setCurrentObject((prev) => {
      if (prev) prev.deselect();
      return object;
    });
  };

  useEffect(() => {
    shapes.filter(notEmpty).map((shape) => {
      const existing = canvasShapes.current.find((s) => s.id === shape.id);
      // if shape exists and is not the current object, update it (update is coming from server)
      if (existing && existing.id !== currentObject?.id) {
        existing.updateGraphics(shape);
        return;
      // if shape exists and is the current object, do not update (update is coming from user, optimistic)
      } else if (existing) {
        return;
      }

      // if shape does not exist, create it (coming from server)
      if (shape.type === "RECTANGLE") {
        canvasShapes.current.push(
          new Rectangle(shape.container, app, {
            onSelect: handleObjectSelect,
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
  }, [update, app, shapes, currentObject]);

  return {
    setCurrentObject: handleObjectSelect,
    currentObject,
  };
};
