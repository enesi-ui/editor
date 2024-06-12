import { ReactNode, useState } from "react";
import { CanvasObjectContext } from "~/canvas/CanvasObjectContext.ts";
import { CanvasObject } from "~/canvas/CanvasObject.ts";

export const CanvasObjectContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentObject, setCurrentObject] = useState<CanvasObject | null>(null);

  const handleObjectSelect = (object: CanvasObject | null) => {
    setCurrentObject((prev) => {
      if (prev) prev.deselect();
      return object;
    });
  };


  return (
    <CanvasObjectContext.Provider
      value={{ currentObject, setCurrentObject: handleObjectSelect }}
    >
      {children}
    </CanvasObjectContext.Provider>
  );
};
