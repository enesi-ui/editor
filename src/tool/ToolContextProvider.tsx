import { ToolContext } from "~/tool/ToolContext.ts";
import { ReactNode, useRef, useState } from "react";
import { MousePosition, Tools } from "~/tool/Tools.ts";
export const ToolContextProvider = ({ children }: { children: ReactNode }) => {
  const [tool, setTool] = useState(Tools.SELECT);
  const position = useRef(MousePosition.CANVAS);

  return (
    <ToolContext.Provider value={{ tool, setTool, position }}>{children}</ToolContext.Provider>
  );
};
