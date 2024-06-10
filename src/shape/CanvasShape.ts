import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { CanvasObject } from "~/canvas/CanvasObject.ts";

export interface Shape {
  id: string;
  type: "ELLIPSE" | "RECTANGLE";
  fill: string;
  fillAlpha: number;
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
}

export interface CanvasShape extends CanvasObject {
  updateGraphics: (data: Shape) => void;
  setFill: (color: string, alpha: number) => void;
  setStrokes: (strokes: StrokePropertyData[]) => void;

  getFill(): string;
  getStroke(): StrokePropertyData[];

  createStyle(className: string): string;

  serialize(): Omit<Shape, "id">;

  // top left corner of shape
  getImageData(): ImageData;
}
