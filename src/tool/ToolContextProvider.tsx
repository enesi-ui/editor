import { ToolContext } from "~/tool/ToolContext.ts";
import { ReactNode, useState } from "react";
import { Tools } from "~/tool/Tools.ts";
export const ToolContextProvider = ({ children }: { children: ReactNode }) => {
  const [tool, setTool] = useState(Tools.SELECT);

  return (
    <ToolContext.Provider value={{ tool, setTool }}>{children}</ToolContext.Provider>
  );
};
