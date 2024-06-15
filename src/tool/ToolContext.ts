import { createContext, MutableRefObject } from "react";
import { MousePosition, Tools } from "~/tool/Tools.ts";

export type ToolContextType = {
  tool: Tools;
  setTool: (tool: Tools) => void;
  position: MutableRefObject<MousePosition>;
}

export const ToolContext = createContext<ToolContextType | null>(null);
