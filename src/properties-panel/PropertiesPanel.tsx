import { PageProperty } from "~/properties-panel/PageProperty.tsx";
import { ShapeProperties } from "~/properties-panel/ShapeProperties.tsx";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useCanvasObjectType } from "~/canvas/useCanvasObjectType.ts";
import { useContext } from "react";
import { CanvasObjectContext } from "~/canvas/CanvasObjectContext.ts";

export interface PropertiesPanelProps {
  width?: number;
}
export const PropertiesPanel = (props: PropertiesPanelProps) => {
  const { width } = props;

  const { currentObject } = useContext(CanvasObjectContext);

  const { isCanvasShape } = useCanvasObjectType();

  return (
    <div
      style={{ width: width ?? "auto" }}
      className="absolute top-[var(--toolbar-height)] bottom-0 right-0 bg-primary-200 flex flex-col border-l-[1px] border-l-base-content/20"
    >
      <div className={'px-2'}>
        <PageProperty />
        <div className="divider"></div>
        {isCanvasShape(currentObject) && (
          <ShapeProperties canvasShape={currentObject as CanvasShape} />
        )}
      </div>
    </div>
  );
};
