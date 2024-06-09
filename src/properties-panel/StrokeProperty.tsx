import { ColorProperty } from "~/properties-panel/ColorProperty.tsx";
import { useState } from "react";
import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { SectionButton } from "~/core/SectionButton.tsx";

interface StrokePropertyProps {
  shape: CanvasShape;
}

export const StrokeProperty = (props: StrokePropertyProps) => {
  const { shape } = props;
  const [strokeProperty, setStrokeProperty] = useState<StrokePropertyData[]>(
    [],
  );

  const handleAddStroke = () => {
    const newStrokeProperty: StrokePropertyData = {
      color: "#ffffff",
      alpha: 1,
      width: 16,
    };
    setStrokeProperty((prev) => {
      const newStrokes = [...prev, newStrokeProperty];
      shape.setStrokes(newStrokes);
      return newStrokes;
    });
  };

  const handleStrokeChange = (index: number, value: string) => {
    setStrokeProperty((prev) => {
      const oldStroke = prev[index];
      prev[index] = {
        ...oldStroke,
        color: value,
      };
      shape.setStrokes(prev);
      return prev;
    });
  };

  const handleStrokeAlphaChange = (index: number, value: number) => {
    setStrokeProperty((prev) => {
      const oldStroke = prev[index];
      prev[index] = {
        ...oldStroke,
        alpha: value,
      };
      shape.setStrokes(prev);
      return prev;
    });
  };

  return (
    <>
      <SectionButton
        onClick={handleAddStroke}
        ariaLabel={"Add stroke"}
        label={"Stroke"}
        icon={"+"}
      />
      {strokeProperty.map((stroke, index) => (
        <ColorProperty
          key={index}
          label={`stroke-${index}`}
          value={stroke.color}
          alpha={stroke.alpha}
          id={`stroke-${index}`}
          onChange={(value) => handleStrokeChange(index, value)}
          onChangeAlpha={(value) => handleStrokeAlphaChange(index, value)}
        />
      ))}
    </>
  );
};
