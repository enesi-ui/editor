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
  const fullWidth = props.fullWidth ? "col-span-2" : "";
  const hoverClass = props.hoverEffect
    ? `hover:border hover:border-[color:var(--color-border,rgba(0,0,0,0.1))] hover:border-solid`
    : "";
  const inputFocus = props.inputFocus
    ? `hover:border hover:border-[color:var(--color-border,rgba(0,0,0,0.1))] hover:border-solid`
    : "";
  const topBorder = props.topBorder
    ? `border-t-[color:var(--color-border)] border-t border-solid`
    : "";

  return (
    <div
      className={`content-box grid grid-rows-1 grid-cols-2 py-1 px-0.5 items-center overflow-hidden whitespace-nowrap ${fullWidth} ${topBorder}`}
    >
      <label
        htmlFor={props.id}
        className={`flex p-1 w-full col-end-[span_2] border border-transparent text-sm text-ellipsis overflow-hidden whitespace-nowrap ${hoverClass}`}
      >
        <span
          className={`flex-[1_1_16%] flex items-center text-sm text-ellipsis`}
        >
          {props.label}
        </span>
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
          className={`bg-primary-100 w-100 border border-transparent w-full ml-1 p-1 text-ellipsis overflow-hidden whitespace-nowrap ${inputFocus}`}
        />
      </label>
    </div>
  );
};
