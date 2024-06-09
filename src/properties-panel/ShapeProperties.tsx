import { Property } from "~/properties-panel/Property.tsx";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useEffect, useState } from "react";
import { usePixi } from "~/pixi/pixiContext.ts";
import { UPDATE_PRIORITY } from "@pixi/ticker";
import { ShapePropertiesData } from "~/properties-panel/ShapePropertiesData.ts";
import { ColorProperty } from "~/properties-panel/ColorProperty.tsx";
import { StrokeProperty } from "~/properties-panel/StrokeProperty.tsx";
import { round } from "~/utility/round.ts";
import { SectionButton } from "~/core/SectionButton.tsx";

export interface ShapePropertiesProps {
  canvasShape: CanvasShape;
}

export const ShapeProperties = (props: ShapePropertiesProps) => {
  const app = usePixi();
  const canvasShape = props.canvasShape;

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
    fill: "#ffffff",
    fillAlpha: 1,
  });

  const handleFillChange = (value: string) => {
    canvasShape.setFill(value, properties.fillAlpha);
    setProperties((prev) => {
      return {
        ...prev,
        fill: value,
      };
    });
  };

  const handleFillAlphaChange = (value: number) => {
    canvasShape.setFill(properties.fill, value);
    setProperties((prev) => {
      return {
        ...prev,
        fillAlpha: value,
      };
    });
  };

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
    );
  };

  return (
    <div className="grid grid-cols-2 px-0 gap-x-2 gap-y-1">
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
      <SectionButton
        onClick={() => console.log("Add Fill")}
        ariaLabel={"Add fill"}
        label={"Fill"}
        icon={"+"}
        className={'col-start-1 col-end-3'}
      />
      <ColorProperty
        label="fill"
        value={properties.fill}
        alpha={properties.fillAlpha}
        id="fill"
        onChange={handleFillChange}
        onChangeAlpha={handleFillAlphaChange}
        className="col-start-1 col-end-3"
      />
      <div className="divider col-start-1 col-end-3"></div>
      <StrokeProperty shape={canvasShape} className={'col-start-1 col-end-3'} />
    </div>
  );
};
