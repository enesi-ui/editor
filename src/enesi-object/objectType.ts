import { Component, EnesiObject } from "~/enesi-object/EnesiObject.ts";
import { Shape } from "~/shape/CanvasShape.ts";
import { componentKeys, shapeKeys } from "~/api/key-factory.ts";

export const isShape = (object: EnesiObject): object is Shape => {
  return (
    (object as Shape).type === "RECTANGLE" ||
    (object as Shape).type === "ELLIPSE"
  );
};

export const isComponent = (object: EnesiObject): object is Component => {
  return (object as Component).dummy !== undefined;
};

export const getCacheKey = (
  object: EnesiObject,
): {
  all: readonly string[];
  detail: readonly string[];
} => {
  if (isShape(object)) {
    return { all: shapeKeys.all, detail: shapeKeys.detail(object.id) };
  }
  if (isComponent(object)) {
    return { all: componentKeys.all, detail: componentKeys.detail(object.id) };
  }
  throw new Error("Invalid object type");
};
