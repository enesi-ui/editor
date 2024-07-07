import { ReactNode, useState } from "react";

export interface SelectableInput {
  value: string;
  onClick: () => void;
  onDoubleClick?: () => void;
  icon?: ReactNode;
  active?: boolean;
  onChange?: (value: string) => void;
  cursorEffect?: 'cursor-pointer' | 'cursor-move';
}

export function SelectableListItemInput(props: SelectableInput) {
  const { value, cursorEffect, active, onClick, onDoubleClick, onChange, icon } =
    props;
  const [isEditing, setIsEditing] = useState(false);

  const [internalValue, setInternalValue] = useState(props.value);

  const handleChange = (value: string) => {
    setInternalValue(value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    onDoubleClick?.();
  };

  const defaultCursorEffect = cursorEffect ?? 'cursor-pointer';

  return (
    <li
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      className={`max-w-2xl ${defaultCursorEffect}`}
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
          <span
            className={`block pl-3  text-ellipsis whitespace-nowrap overflow-hidden`}
          >
            {value}
          </span>
        )}
      </span>
    </li>
  );
}
