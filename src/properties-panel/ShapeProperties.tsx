import { Property } from "~/properties-panel/Property.tsx";
import { useEffect, useState } from "react";
import { ShapePropertiesData } from "~/properties-panel/ShapePropertiesData.ts";
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

  const { x, y } = shape?.container || { x: 0, y: 0 };
  const {
    graphics: { width, height },
    radius,
  } = shape || { graphics: { width: 0, height: 0 }, radius: 0 };

  const [properties, setProperties] = useState<ShapePropertiesData>({
    x: x.toString(),
    y: y.toString(),
    width: width.toString(),
    height: height.toString(),
    radius: radius.toString(),
  });

  const handlePropertyChange = async (
    id: "x" | "y" | "width" | "height" | "radius",
    value: string,
  ) => {
    if (!shapeId) return;
    setProperties((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePropertyFinish = async () => {
    if (!shapeId) return;
    const roundedX = round(properties.x);
    const roundedY = round(properties.y);
    const roundedWidth = round(properties.width);
    const roundedHeight = round(properties.height);
    const roundedRadius = round(properties.radius);
    setProperties((prevState) => ({
      ...prevState,
      x: roundedX,
      y: roundedY,
      width: roundedWidth,
      height: roundedHeight,
      radius: roundedRadius,
    }));
    await update({
      id: shapeId,
      container: {
        x: parseFloat(roundedX),
        y: parseFloat(roundedY),
        width: 0,
        height: 0,
      },
      graphics: {
        x: 0,
        y: 0,
        width: parseFloat(roundedWidth),
        height: parseFloat(roundedHeight),
      },
      radius: parseFloat(roundedRadius),
    });
  };

  useEffect(() => {
    if (!shape) return;
    const {
      container: { x, y },
      graphics: { width, height },
      radius,
    } = shape;
    setProperties({
      x: x.toString(),
      y: y.toString(),
      width: width.toString(),
      height: height.toString(),
      radius: radius.toString(),
    });
  }, [shape]);

  return (
    <div className="grid grid-cols-2 px-0 gap-x-2 gap-y-1 mx-2">
      <Property
        topBorder
        hoverEffect
        label="X"
        value={properties.x}
        id="x"
        type="number"
        onChange={(value) => handlePropertyChange("x", value)}
        onFinish={() => handlePropertyFinish()}
      />
      <Property
        topBorder
        hoverEffect
        label="Y"
        value={properties.y}
        id="y"
        type="number"
        onChange={(value) => handlePropertyChange("y", value)}
        onFinish={handlePropertyFinish}
      />
      <Property
        hoverEffect
        label="W"
        id="width"
        type="number"
        value={properties.width}
        onChange={(value) => handlePropertyChange("width", value)}
        onFinish={handlePropertyFinish}
      />
      <Property
        hoverEffect
        label="H"
        value={properties.height}
        id="height"
        type="number"
        onChange={(value) => handlePropertyChange("height", value)}
        onFinish={handlePropertyFinish}
      />
      <Property
        hoverEffect
        label="R"
        value={properties.radius}
        id="radius"
        type="number"
        onChange={(value) => handlePropertyChange("radius", value)}
        onFinish={handlePropertyFinish}
      />
      <div className="divider col-start-1 col-end-3"></div>
      <FillProperty shapeId={shapeId} className={"col-start-1 col-end-3"} />
      <div className="divider col-start-1 col-end-3"></div>
      <StrokeProperty shapeId={shapeId} className={"col-start-1 col-end-3"} />
    </div>
  );
};
