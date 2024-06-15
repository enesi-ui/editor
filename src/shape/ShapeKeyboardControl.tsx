import { useContext, useEffect } from "react";
import { useShapeRemove } from "~/shape/useShapeRemove.ts";
import { CanvasObjectContext } from "~/canvas/CanvasObjectContext.ts";
import { useToolsContext } from "~/tool/useToolsContext.ts";
import { MousePosition } from "~/tool/Tools.ts";

export const ShapeKeyboardControl = ({
  canvasShapeId,
  inCanvas
}: {
  canvasShapeId: string;
  inCanvas?: boolean;
}) => {
  const { remove } = useShapeRemove();

  const { setCurrentObject, currentObject } = useContext(CanvasObjectContext);

  const { position } = useToolsContext();

  useEffect(() => {
    const deleteHandler = async (event: KeyboardEvent) => {
      if (position.current !== MousePosition.CANVAS || !currentObject) return;
      if (event.key === "Backspace" || event.key === "Delete") {
        await remove(canvasShapeId);
        currentObject?.clear();
        setCurrentObject(null);
      }
    };
    window.addEventListener("keydown", deleteHandler);
    return () => {
      window.removeEventListener("keydown", deleteHandler);
    };
  }, [currentObject, setCurrentObject, remove, canvasShapeId, inCanvas]);
  return null;
};
