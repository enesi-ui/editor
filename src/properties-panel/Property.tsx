import { useState } from "react";

interface PropertyProps {
  label: string;
  id: string;
  onChange?: (value: string) => void;
  value: string | number;
  type?: "text" | "number";
  fullWidth?: boolean;
  step?: number;
  topBorder?: boolean;
}
export const Property = (props: PropertyProps) => {
  const {
    value,
    id,
    label,
    type,
    step,
    onChange,
  } = props;
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (value: string) => {
    setInternalValue(value);
  };

  return (
    <label
      htmlFor={id}
      className={`input input-ghost input-sm flex items-center gap-2`}
    >
      {label}
      <input
        id={id}
        // note: number type breaks on all browsers with proper localisation
        // we use the pattern and step to enforce number input
        type={"text"}
        value={internalValue}
        pattern={type === "number" ? "[0-9]+([.,][0-9]+)?" : undefined}
        step={type === "number" ? step ?? "1" : undefined}
        onChange={(e) => {
          e.preventDefault();
          return handleChange(e.target.value);
        }}
        onBlur={(e) => {
          e.preventDefault();
          return onChange?.(internalValue.toString());
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            return onChange?.(internalValue.toString());
          }
        }}
        className={"w-full"}
      />
    </label>
  );
};
