import { ColorProperty } from "~/properties-panel/ColorProperty.tsx";
import { useState } from "react";
import { FillPropertyData } from "~/properties-panel/FillPropertyData.ts";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { SectionButton } from "~/core/SectionButton.tsx";
import { PlusIcon } from "~/icon/PlusIcon.tsx";

interface FillPropertyProps {
  shape: CanvasShape;
  className?: string;
}

// todo no state needed use the shape from useshape
export const FillProperty = (props: FillPropertyProps) => {
  const { shape, className } = props;
  const [fillProperty, setFillProperty] = useState<FillPropertyData[]>(
    shape.getFill(),
  );

  const handleAddFill = () => {
    const newFillProperty: FillPropertyData = {
      color: "#ffffff",
      alpha: 1,
    };
    setFillProperty((prev) => {
      const newFills = [...prev, newFillProperty];
      shape.setFill(newFills, true);
      return newFills;
    });
  };

  const handleFillChange = (index: number, value: string) => {
    setFillProperty((prev) => {
      const oldFill = prev[index];
      prev[index] = {
        ...oldFill,
        color: value,
      };
      shape.setFill(prev, true);
      return prev;
    });
  };

  const handleFillAlphaChange = (index: number, value: number) => {
    setFillProperty((prev) => {
      const oldFill = prev[index];
      prev[index] = {
        ...oldFill,
        alpha: value,
      };
      shape.setFill(prev, true);
      return prev;
    });
  };

  const handleRemoveFill = (index: number) => {
    setFillProperty((prev) => {
      const newFills = prev.filter((_, i) => i !== index);
      shape.setFill(newFills, true);
      return newFills;
    });
  };

  const handleVisibilityToggle = (index: number) => {
    setFillProperty((prev) => {
      const oldFill = prev[index];
      prev[index] = {
        ...oldFill,
        hidden: !oldFill.hidden,
      };
      shape.setFill(prev, true);
      return prev;
    });
  };

  return (
    <>
      <SectionButton
        onClick={handleAddFill}
        ariaLabel={"Add fill"}
        label={"Fill"}
        icon={<PlusIcon />}
        className={className}
      />
      {fillProperty.map((fill, index) => (
        <ColorProperty
          key={index}
          label={`fill-${index}`}
          value={fill.color}
          alpha={fill.alpha}
          id={`fill-${index}`}
          onChange={(value) => handleFillChange(index, value)}
          onChangeAlpha={(value) => handleFillAlphaChange(index, value)}
          className={className}
          onRemove={() => handleRemoveFill(index)}
          onToggleVisibility={() => handleVisibilityToggle(index)}
          hidden={fill.hidden}
        />
      ))}
    </>
  );
};
