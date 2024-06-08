interface ColorPropertyProps {
  label: string;
  value: string;
  alpha: number;
  id: string;
  onChange?: (value: string) => void;
  onChangeAlpha?: (value: number) => void;
  topBorder?: boolean;
  showLabel?: boolean;
}
export const ColorProperty = (props: ColorPropertyProps) => {
  const topBorder = props.topBorder
    ? "border-t-[color:var(--color-border)] border-t border-solid"
    : "";

  return (
    <div
      className={`grid grid-rows-1 grid-cols-3 p-2 items-center col-span-2 ${topBorder}`}
    >
      {props.showLabel &&
        <label
          htmlFor={props.id}
          className="flex w-full col-end-[span_3]  pb-2 text-sm"
        >
          <span className="flex-[1_1_32%]">{props.label}</span>
        </label>
      }
      <input
        id={props.id}
        type={"color"}
        defaultValue={props.value}
        aria-label={props.showLabel ? props.label : undefined}
        onChange={(e) => {
          e.preventDefault();
          return props.onChange?.(e.target.value);
        }}
        className="bg-primary-100 w-100 ml-0 pl-0 border-l-0 w-full flex-[1_1_46%]"
      />
      <input
        step={0.01}
        id={`${props.id}-alpha`}
        type="number"
        defaultValue={props.alpha}
        onChange={(e) => {
          e.preventDefault();
          return props.onChangeAlpha?.(parseFloat(e.target.value));
        }}
        className="bg-primary-100 w-100 ml-0 pl-0 border-l-0 w-full flex-[1_1_46%]"
      />
      <span className="ml-4 flex-[1_1_42%]">{props.value}</span>
    </div>
  );
};
