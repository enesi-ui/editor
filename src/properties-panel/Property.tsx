interface PropertyProps {
  label: string;
  defaultValue?: string | number;
  id: string;
  onChange?: (value: string) => void;
  value?: string | number;
  onFinish?: () => void;
  type?: "text" | "number";
  fullWidth?: boolean;
  step?: number;
  hoverEffect?: boolean;
  inputFocus?: boolean;
  topBorder?: boolean;
}
export const Property = (props: PropertyProps) => {
  return (
    <label
      htmlFor={props.id}
      className={`input input-ghost input-sm flex items-center gap-2`}
    >
      {props.label}
      <input
        id={props.id}
        // note: number type breaks on all browsers with proper localisation
        // we use the pattern and step to enforce number input
        type={"text"}
        defaultValue={props.defaultValue}
        value={props.value}
        pattern={props.type === "number" ? "[0-9]+([.,][0-9]+)?" : undefined}
        step={props.type === "number" ? props.step ?? "1" : undefined}
        onChange={(e) => {
          e.preventDefault();
          return props.onChange?.(e.target.value);
        }}
        onBlur={(e) => {
          e.preventDefault();
          return props.onFinish?.();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            return props.onFinish?.();
          }
        }}
        className={'w-full'}
      />
    </label>
  );
};
