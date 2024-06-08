interface PropertyProps {
  label: string;
  defaultValue: boolean;
  id: string;
  onChange?: (value: boolean) => void;
  fullWidth?: boolean;
  step?: number;
  hoverEffect?: boolean;
  topBorder?: boolean;
  inputFocus?: boolean;
}
export const CheckboxProperty = (props: PropertyProps) => {
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
    <div className={`content-box grid grid-rows-1 grid-cols-2 p-2 items-center overflow-hidden whitespace-nowrap ${fullWidth} ${topBorder}`}>
      <label htmlFor={props.id} className={`flex p-1 w-full col-end-[span_2] border border-transparent text-sm text-ellipsis overflow-hidden whitespace-nowrap ${hoverClass}`}>
        <span className={`bg-primary-100 w-100 border border-transparent w-full ml-2 p-1 text-ellipsis overflow-hidden whitespace-nowrap ${inputFocus}`}>{props.label}</span>
        <input
          id={props.id}
          type={"checkbox"}
          defaultChecked={props.defaultValue}
          onChange={(e) => {
            return props.onChange?.(e.target.checked);
          }}
        />
      </label>
    </div>
  );
};
