import { Property } from "~/properties-panel/Property.tsx";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useEffect, useState } from "react";
import { usePixi } from "~/pixi/pixiContext.ts";
import { UPDATE_PRIORITY } from "@pixi/ticker";
import { ShapePropertiesData } from "~/properties-panel/ShapePropertiesData.ts";
import { StrokeProperty } from "~/properties-panel/StrokeProperty.tsx";
import { round } from "~/utility/round.ts";
import { FillProperty } from "~/properties-panel/FillProperty.tsx";

export interface ShapePropertiesProps {
  canvasShape: CanvasShape;
}

export const ShapeProperties = (props: ShapePropertiesProps) => {
  const app = usePixi();
  const { canvasShape } = props;

  const shapeId = canvasShape.id;

  useEffect(() => {
    const tickerCallback = () => {
      setProperties((prevState) => {
        const { x, y } = canvasShape.getOrigin();
        const { width, height } = canvasShape.getSize();
        return {
          ...prevState,
          x: x.toString(),
          y: y.toString(),
          width: width.toString(),
          height: height.toString(),
        };
      });
    };
    app.ticker.add(tickerCallback, null, UPDATE_PRIORITY.LOW);

    canvasShape.on("pointerover", () => {
      app.ticker.add(tickerCallback, null, UPDATE_PRIORITY.LOW);
    });

    canvasShape.on("pointerout", () => {
      app.ticker.remove(tickerCallback);
    });
  }, [app, canvasShape]);

  const { x, y } = canvasShape.getOrigin();
  const { width, height } = canvasShape.getSize();
  const [properties, setProperties] = useState<ShapePropertiesData>({
    x: x.toString(),
    y: y.toString(),
    width: width.toString(),
    height: height.toString(),
  });

  const handlePropertyChange = async (
    id: "x" | "y" | "width" | "height",
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
        label="x"
        value={properties.x}
        id="x"
        type="number"
        onChange={(value) => handlePropertyChange("x", value)}
        onFinish={() => handlePropertyFinish()}
      />
      <Property
        topBorder
        hoverEffect
        label="y"
        value={properties.y}
        id="y"
        type="number"
        onChange={(value) => handlePropertyChange("y", value)}
        onFinish={() => handlePropertyFinish()}
      />
      <Property
        hoverEffect
        label="w"
        id="width"
        type="number"
        value={properties.width}
        onChange={(value) => handlePropertyChange("width", value)}
        onFinish={() => handlePropertyFinish()}
      />
      <Property
        hoverEffect
        label="h"
        value={properties.height}
        id="height"
        type="number"
        onChange={(value) => handlePropertyChange("height", value)}
        onFinish={() => handlePropertyFinish()}
      />
      <div className="divider col-start-1 col-end-3"></div>
      <FillProperty shape={canvasShape} className={"col-start-1 col-end-3"} />
      <div className="divider col-start-1 col-end-3"></div>
      <StrokeProperty shape={canvasShape} className={"col-start-1 col-end-3"} />
    </div>
  );
};
