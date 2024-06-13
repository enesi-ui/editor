interface ColorPropertyProps {
  label: string;
  value: string;
  alpha?: number;
  id: string;
  onChange?: (value: string) => void;
  onChangeAlpha?: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}
export const ColorProperty = (props: ColorPropertyProps) => {
  const {
    label,
    value,
    alpha,
    id,
    onChange,
    onChangeAlpha,
    className,
    showLabel,
  } = props;

  return (
    <div
      className={`input input-ghost input-sm flex items-center gap-2 group ${className}`}
    >
      {showLabel && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={"color"}
        value={value}
        aria-label={showLabel ? label : undefined}
        onChange={(e) => {
          e.preventDefault();
          return onChange?.(e.target.value);
        }}
        className="w-11"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          e.preventDefault();
          return onChange?.(e.target.value[0] !== "#" ? `#${e.target.value}` : e.target.value);
        }}
        className="w-full flex-[2_1_auto]"
      />

      {alpha !== undefined && (
        <input
          step={0.01}
          id={`${id}-alpha`}
          type="number"
          defaultValue={alpha}
          onChange={(e) => {
            e.preventDefault();
            return onChangeAlpha?.(parseFloat(e.target.value));
          }}
          className={
            "pl-1 w-full flex-[1_2_auto] group-hover:border-l group-hover:border-base-content/20"
          }
        />
      )}
    </div>
  );
};
