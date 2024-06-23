import { ColorProperty } from "~/properties-panel/ColorProperty.tsx";
import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { SectionButton } from "~/core/SectionButton.tsx";
import { PlusIcon } from "~/icon/PlusIcon.tsx";
import { useShape } from "~/shape/useShape.ts";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";

interface StrokePropertyProps {
  shapeId: string;
  className?: string;
}

export const StrokeProperty = (props: StrokePropertyProps) => {
  const { shapeId, className } = props;
  const { shape } = useShape(shapeId);
  const { update } = useShapeUpdate();


  const handleAddStroke = async () => {
    const newStrokeProperty: StrokePropertyData = {
      color: "#ffffff",
      alpha: 1,
      width: 16,
    };
    await update({
      id: shapeId,
      strokes: [...(shape?.strokes ?? []), newStrokeProperty],
    });
  };

  const handleStrokeChange = async (index: number, value: string) => {
    const strokes = shape?.strokes ?? [];
    strokes[index] = {
      ...strokes[index],
      color: value,
    };
    await update({
      id: shapeId,
      strokes,
    });
  };

  const handleStrokeAlphaChange = async (index: number, value: number) => {
    const strokes = shape?.strokes ?? [];
    strokes[index] = {
      ...strokes[index],
      alpha: value,
    };
    await update({
      id: shapeId,
      strokes,
    });
  };

  const handleRemoveStrokes = async (index: number) => {
    const strokes = shape?.strokes.filter((_, i) => i !== index);
    await update({
      id: shapeId,
      strokes,
    });
  };

  const handleVisibilityToggle = (index: number) => {
    console.log("visibility toggle", index);
  };


  return (
    <>
      <SectionButton
        onClick={handleAddStroke}
        ariaLabel={"Add stroke"}
        label={"Stroke"}
        icon={<PlusIcon />}
        className={className}
      />
      {shape?.strokes.map((stroke, index) => (
        <ColorProperty
          key={index}
          label={`stroke-${index}`}
          value={stroke.color}
          alpha={stroke.alpha}
          id={`stroke-${index}`}
          onChange={(value) => handleStrokeChange(index, value)}
          onRemove={() => handleRemoveStrokes(index)}
          onToggleVisibility={() => handleVisibilityToggle(index)}
          onChangeAlpha={(value) => handleStrokeAlphaChange(index, value)}
          className={className}
        />
      ))}
    </>
  );
};
