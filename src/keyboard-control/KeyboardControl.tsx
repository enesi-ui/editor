import { useCanvasObjectType } from "~/canvas/useCanvasObjectType.ts";
import { ShapeKeyboardControl } from "~/shape/ShapeKeyboardControl.tsx";
import { useContext } from "react";
import { CanvasObjectContext } from "~/canvas/CanvasObjectContext.ts";

export const KeyboardControl = () => {
  const { currentObject } = useContext(CanvasObjectContext);

  const { isCanvasShape } = useCanvasObjectType();

  const id = currentObject?.id;

  return (
    <>
      {isCanvasShape(currentObject) && id && (
        <ShapeKeyboardControl canvasShapeId={id} />
      )}
    </>
  );
};
