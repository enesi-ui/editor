import { PageProperty } from "~/properties-panel/PageProperty.tsx";
import { ShapeProperties } from "~/properties-panel/ShapeProperties.tsx";
import { useSelection } from "~/canvas/useSelection.ts";

export const PropertiesPanel = ({ canvasId }: { canvasId: string }) => {
  const { selectedShapes } = useSelection(canvasId);

  return (
    <div className="absolute top-[var(--toolbar-height)] bottom-0 right-0 bg-base-100 flex flex-col border-l-[1px] border-l-base-content/20 z-10 w-72">
      <PageProperty />
      <div className="divider"></div>
      {selectedShapes && selectedShapes.length > 0 && selectedShapes?.[0] && (
        <ShapeProperties shapeId={selectedShapes?.[0]} />
      )}
    </div>
  );
};
