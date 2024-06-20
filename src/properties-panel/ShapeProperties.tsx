import { Property } from "~/properties-panel/Property.tsx";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useEffect, useState } from "react";
import { usePixi } from "~/pixi/pixiContext.ts";
import { ShapePropertiesData } from "~/properties-panel/ShapePropertiesData.ts";
import { StrokeProperty } from "~/properties-panel/StrokeProperty.tsx";
import { round } from "~/utility/round.ts";
import { FillProperty } from "~/properties-panel/FillProperty.tsx";
import { useShape } from "~/shape/useShape.ts";

export interface ShapePropertiesProps {
  canvasShape: CanvasShape;
}

export const ShapeProperties = (props: ShapePropertiesProps) => {
  const app = usePixi();
  const { canvasShape } = props;

  const { shape } = useShape(canvasShape.id);

  const shapeId = canvasShape.id;

  const { x, y } = canvasShape.getOrigin();
  const { width, height, radius } = canvasShape.getSize();
  const [properties, setProperties] = useState<ShapePropertiesData>({
    x: x.toString(),
    y: y.toString(),
    width: width.toString(),
    height: height.toString(),
    radius: radius.toString(),
  });

  useEffect(() => {
    if (!shape) return;
    setProperties((prevState) => {
      const {
        container: { x, y },
        graphics: { width, height },
      } = shape;
      return {
        ...prevState,
        x: x.toString(),
        y: y.toString(),
        width: width.toString(),
        height: height.toString(),
      };
    });
  }, [app, shape, setProperties]);

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
    setProperties((prevState) => ({
      ...prevState,
      x: roundedX,
      y: roundedY,
      width: roundedWidth,
      height: roundedHeight,
    }));
    canvasShape.setSizeOrigin(
      parseFloat(roundedX),
      parseFloat(roundedY),
      parseFloat(roundedWidth),
      parseFloat(roundedHeight),
      false,
      true,
    );
  };

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
      <FillProperty shape={canvasShape} className={"col-start-1 col-end-3"} />
      <div className="divider col-start-1 col-end-3"></div>
      <StrokeProperty shape={canvasShape} className={"col-start-1 col-end-3"} />
    </div>
  );
};
