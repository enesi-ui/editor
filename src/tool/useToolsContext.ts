import { useContext, useRef } from "react";
import { ToolContext, ToolContextType } from "~/tool/ToolContext.ts";
import { toolInToolbar } from "~/core/commonClasses.ts";
import { Tools } from "~/tool/Tools.ts";

export const useToolsContext = () => {
  const { tool: currentTool, setTool, position } = useContext(ToolContext) as ToolContextType;

  const toolref = useRef(currentTool);

  toolref.current = currentTool;

  return {
    tool: toolref,
    position,
    setTool,
    classes : (tool: Tools) => {
      return toolInToolbar(toolref.current === tool);
    }
  }
};
