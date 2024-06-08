import { createContext } from "react";
import { Tools } from "~/tool/Tools.ts";

export type ToolContextType = {
  tool: Tools;
  setTool: (tool: Tools) => void;
}

export const ToolContext = createContext<ToolContextType | null>(null);
