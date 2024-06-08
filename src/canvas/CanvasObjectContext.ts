import { createContext } from "react";
import { CanvasObject } from "~/canvas/CanvasObject.ts";

export type CanvasObjectContextType = {
  currentObject: CanvasObject | null;
  setCurrentObject: (object: CanvasObject | null) => void;
}

export const CanvasObjectContext = createContext<CanvasObjectContextType>({
  currentObject: null,
  setCurrentObject: () => {},
});
