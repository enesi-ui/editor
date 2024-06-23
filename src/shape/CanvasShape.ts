import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { CanvasObject } from "~/canvas/CanvasObject.ts";
import { FillPropertyData } from "~/properties-panel/FillPropertyData.ts";

export interface Shape {
  id: string;
  name: string;
  type: "ELLIPSE" | "RECTANGLE";
  fills: FillPropertyData[];
  strokes: StrokePropertyData[];
  container: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  graphics: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  zIndex: number;
  radius: number;
  canvasId: string;
}

export interface CanvasShape extends CanvasObject {
  update: (data: Shape) => void;
  serialize(): Omit<Shape, "id">;

  // top left corner of shape
  getImageData(): ImageData;

  createStyle(className: string): string;
}
