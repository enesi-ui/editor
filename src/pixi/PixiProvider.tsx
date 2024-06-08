import { FunctionComponent, ReactNode } from "react";
import { app, PixiContext } from "./pixiContext.ts";

export const PixiProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return <PixiContext.Provider value={app}>{children}</PixiContext.Provider>;
};
