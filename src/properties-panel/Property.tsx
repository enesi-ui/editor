import { useState } from "react";

interface PropertyProps {
  label: string;
  id: string;
  onChange?: (value: string) => void;
  value: string | number;
  type?: "text" | "number";
  fullWidth?: boolean;
  step?: number;
  hideLabel?: boolean;
  showBorders?: boolean;
}
export const Property = (props: PropertyProps) => {
  const { value, id, label, type, step, onChange, showBorders, hideLabel } =
    props;
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (value: string) => {
    setInternalValue(value);
  };

  const cleanValue = (input: string) => {
    if (type === "number") {
      const number = parseFloat(input);
      if (isNaN(number)) {
        return value;
      }
      return number;
    }
    return input;
  }

  return (
    <label
      htmlFor={id}
      className={`input input-sm flex items-center gap-2 ${
        showBorders ? "input-bordered" : "input-ghost"
      }`}
      aria-label={hideLabel ? label : ''}
    >
      {!hideLabel && label}
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
          const cleanedValue = cleanValue(internalValue.toString());
          setInternalValue(cleanedValue.toString());
          return onChange?.(cleanedValue.toString());
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            const cleanedValue = cleanValue(internalValue.toString());
            console.log(cleanedValue);
            setInternalValue(cleanedValue.toString());
            e.currentTarget.blur();
            return onChange?.(cleanedValue.toString());
          }
        }}
        className={"w-full"}
      />
    </label>
  );
};
