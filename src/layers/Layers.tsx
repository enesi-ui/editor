import { useShapes } from "~/shape/useShapes.ts";
import { RectangleIcon } from "~/icon/RectangleIcon.tsx";
import { useSelection } from "~/canvas/useSelection.ts";
import { ReactNode, useState } from "react";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";
import { useShape } from "~/shape/useShape.ts";

export interface SelectableInput {
  value: string;
  onClick: () => void;
  onDoubleClick?: () => void;
  icon?: ReactNode;
  active?: boolean;
  onChange?: (value: string) => void;
}

export function SelectableListItemInput(props: SelectableInput) {
  const { value, active, onClick, onDoubleClick, onChange, icon } = props;
  const [isEditing, setIsEditing] = useState(false);

  const [internalValue, setInternalValue] = useState(props.value);

  const handleChange = (value: string) => {
    setInternalValue(value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    onDoubleClick?.();
  };

  return (
    <li
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      className=" max-w-2xl"
    >
      <span className={active ? "active" : ""}>
        {icon}
        {isEditing && active ? (
          <input
            ref={(input) => input?.focus()}
            size={12}
            type="text"
            autoCorrect="false"
            spellCheck="false"
            dir="auto"
            autoCapitalize="false"
            className="input-borderless-sm h-5 w-full "
            value={internalValue}
            onChange={(e) => {
              e.preventDefault();
              return handleChange(e.target.value);
            }}
            onBlur={(e) => {
              e.preventDefault();
              setIsEditing(false);
              return onChange?.(internalValue);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                setIsEditing(false);
                return onChange?.(internalValue);
              }
            }}
          />
        ) : (
          <span className={`block pl-3  text-ellipsis whitespace-nowrap overflow-hidden`}>{value}</span>
        )}
      </span>
    </li>
  );
}

export function Layer({ shapeId }: { shapeId: string }) {
  const { shape } = useShape(shapeId);
  const { update, isPending, variables } = useShapeUpdate();
  const { deselectAllSelect, selectedShapes } = useSelection();

  const handleClick = async (shapeId: string) => {
    await deselectAllSelect(shapeId);
  };

  if (isPending) console.log("shape", isPending, variables?.name, shape?.name);

  return (
    shape && (
      <SelectableListItemInput
        key={shape.id}
        value={isPending && variables?.name ? variables.name : shape.name}
        onClick={() => handleClick(shape.id)}
        icon={<RectangleIcon />}
        active={selectedShapes?.includes(shape.id)}
        onChange={(value) => update({ id: shape.id, name: value })}
      />
    )
  );
}

export function Layers() {
  const { shapes } = useShapes();

  const orderedShapes = shapes?.sort((a, b) => a.zIndex - b.zIndex);

  return (
    <ul className="menu rounded-lg w-full">
      {orderedShapes?.map((shape) => <Layer shapeId={shape.id} key={shape.id} />)}
    </ul>
  );
}
