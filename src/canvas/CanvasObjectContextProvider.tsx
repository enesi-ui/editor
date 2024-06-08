import { ReactNode } from "react";
import { CanvasObjectContext } from "~/canvas/CanvasObjectContext.ts";
import { useCanvasShapes } from "~/canvas/useCanvasShapes.ts";

export const CanvasObjectContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currentObject, setCurrentObject } = useCanvasShapes();

  return (
    <CanvasObjectContext.Provider
      value={{ currentObject, setCurrentObject }}
    >
      {children}
    </CanvasObjectContext.Provider>
  );
};
