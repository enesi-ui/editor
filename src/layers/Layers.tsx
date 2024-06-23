import { useShapes } from "~/shape/useShapes.ts";
import { RectangleIcon } from "~/icon/RectangleIcon.tsx";
import { useSelection } from "~/canvas/useSelection.ts";

export function Layers() {
  const { shapes } = useShapes();
  const { deselectAllSelect, selectedShapes } = useSelection();

  const className = (id: string) =>
    selectedShapes?.includes(id) ? "active" : "";

  const handleClick = async (shapeId: string) => {
    await deselectAllSelect(shapeId);
  };

  return (
    <ul className="menu rounded-lg w-full">
      {shapes?.map((shape) => (
        <li key={shape.id} onClick={() => handleClick(shape.id)}>
          <span className={className(shape.id)}>
            <RectangleIcon />
            {shape.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
