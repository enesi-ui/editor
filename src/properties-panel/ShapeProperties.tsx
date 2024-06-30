import { Property } from "~/properties-panel/Property.tsx";
import { StrokeProperty } from "~/properties-panel/StrokeProperty.tsx";
import { round } from "~/utility/round.ts";
import { FillProperty } from "~/properties-panel/FillProperty.tsx";
import { useShape } from "~/shape/useShape.ts";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";

export interface ShapePropertiesProps {
  shapeId: string;
}

export const ShapeProperties = (props: ShapePropertiesProps) => {
  const { shapeId } = props;

  const { shape } = useShape(shapeId);
  const { update } = useShapeUpdate();

  const {
    container: { x, y },
    graphics: { width, height },
    radius,
  } = shape || {
    container: { x: 0, y: 0 },
    graphics: { width: 0, height: 0 },
    radius: 0,
  };

  const handlePropertyChange = async (
    id: "x" | "y" | "width" | "height" | "radius",
    value: string,
  ) => {
    if (!shapeId) return;
    const rounded = round(value);

    switch (id) {
      case "x":
        update({
          id: shapeId,
          container: { x: parseFloat(rounded), y, height, width },
        });
        break;
      case "y":
        update({
          id: shapeId,
          container: { y: parseFloat(rounded), x, height, width },
        });
        break;
      case "width":
        update({
          id: shapeId,
          graphics: { width: parseFloat(rounded), height, x, y },
        });
        break;
      case "height":
        update({
          id: shapeId,
          graphics: { height: parseFloat(rounded), width, x, y },
        });
        break;
      case "radius":
        update({ id: shapeId, radius: parseFloat(rounded) });
        break;
    }
  };

  return (
    <div className="grid grid-cols-2 px-0 gap-x-2 gap-y-1 mx-2">
      <Property
        key={`x-${x}`}
        topBorder
        label="X"
        value={x}
        id="x"
        type="number"
        onChange={(value) => handlePropertyChange("x", value)}
      />
      <Property
        key={`y-${y}`}
        topBorder
        label="Y"
        value={y}
        id="y"
        type="number"
        onChange={(value) => handlePropertyChange("y", value)}
      />
      <Property
        key={`W-${width}`}
        label="W"
        id="width"
        type="number"
        value={width}
        onChange={(value) => handlePropertyChange("width", value)}
      />
      <Property
        key={`H-${height}`}
        label="H"
        value={height}
        id="height"
        type="number"
        onChange={(value) => handlePropertyChange("height", value)}
      />
      <Property
        key={`R-${radius}`}
        label="R"
        value={radius}
        id="radius"
        type="number"
        onChange={(value) => handlePropertyChange("radius", value)}
      />
      <div className="divider col-start-1 col-end-3"></div>
      <FillProperty shapeId={shapeId} className={"col-start-1 col-end-3"} />
      <div className="divider col-start-1 col-end-3"></div>
      <StrokeProperty shapeId={shapeId} className={"col-start-1 col-end-3"} />
    </div>
  );
};
