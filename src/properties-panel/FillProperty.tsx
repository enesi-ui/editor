import { ColorProperty } from "~/properties-panel/ColorProperty.tsx";
import { FillPropertyData } from "~/properties-panel/FillPropertyData.ts";
import { SectionButton } from "~/core/SectionButton.tsx";
import { PlusIcon } from "~/icon/PlusIcon.tsx";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";
import { useShape } from "~/shape/useShape.ts";

interface FillPropertyProps {
  shapeId: string;
  className?: string;
}

export const FillProperty = (props: FillPropertyProps) => {
  const { shapeId, className } = props;
  const { shape } = useShape(shapeId);
  const { update } = useShapeUpdate();

  const handleAddFill = async () => {
    const newFillProperty: FillPropertyData = {
      color: "#ffffff",
      alpha: 1,
    };
    await update({
      id: shapeId,
      fills: [...(shape?.fills ?? []), newFillProperty],
    });
  };

  const handleFillChange = async (index: number, value: string) => {
    const fills = shape?.fills ?? [];
    fills[index] = {
      ...fills[index],
      color: value,
    };
    await update({
      id: shapeId,
      fills,
    });
  };

  const handleFillAlphaChange = async (index: number, value: number) => {
    const fills = shape?.fills ?? [];
    fills[index] = {
      ...fills[index],
      alpha: value,
    };
    await update({
      id: shapeId,
      fills,
    });
  };

  const handleRemoveFill = async (index: number) => {
    const fills = shape?.fills.filter((_, i) => i !== index);
    await update({
      id: shapeId,
      fills,
    });
  };

  const handleVisibilityToggle = (index: number) => {
    console.log("visibility toggle", index);
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
      {shape?.fills.map((fill, index) => (
        <ColorProperty
          key={index}
          label={`fill-${index}`}
          value={fill.color}
          alpha={fill.alpha}
          id={`fill-${index}`}
          onChange={(value) => handleFillChange(index, value)}
          onChangeAlpha={(value) => handleFillAlphaChange(index, value)}
          className={`pr-3 ${className}`}
          onRemove={() => handleRemoveFill(index)}
          onToggleVisibility={() => handleVisibilityToggle(index)}
          hidden={fill.hidden}
        />
      ))}
    </>
  );
};
