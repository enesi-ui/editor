import { Shape } from "~/shape/CanvasShape.ts";

export interface Component {
  id: string;
  dummy: boolean;
  zIndex: number;
  name: string;
}


export type EnesiObject = Shape | Component;
