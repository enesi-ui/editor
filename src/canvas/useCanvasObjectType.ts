import { CanvasObject } from "~/canvas/CanvasObject.ts";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { Rectangle } from "~/shape/Rectangle.ts";
import { Ellipse } from "~/shape/Ellipse.ts";
import { CanvasDataResource } from "~/data-resource/CanvasDataResource.ts";

export const useCanvasObjectType = () => {
  const isCanvasShape = (
    object: CanvasObject | null,
  ): object is CanvasShape => {
    return object instanceof Rectangle || object instanceof Ellipse;
  };

  const isCanvasDataResource = (
    object: CanvasObject | null,
  ): object is CanvasDataResource => {
    return object instanceof CanvasDataResource;
  };
  return { isCanvasShape, isCanvasDataResource };
};
