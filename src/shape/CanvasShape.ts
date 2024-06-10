import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { CanvasObject } from "~/canvas/CanvasObject.ts";
import { FillPropertyData } from "~/properties-panel/FillPropertyData.ts";

export interface Shape {
  id: string;
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
}

export interface CanvasShape extends CanvasObject {
  updateGraphics: (data: Shape) => void;
  setFill: (fills: FillPropertyData[], emit?: boolean) => void;
  setStrokes: (strokes: StrokePropertyData[], emit?: boolean) => void;

  getFill(): FillPropertyData[];
  getStroke(): StrokePropertyData[];

  serialize(): Omit<Shape, "id">;

  // top left corner of shape
  getImageData(): ImageData;

}
