interface ColorPropertyProps {
  label: string;
  value: string;
  alpha: number;
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
        defaultValue={value}
        aria-label={showLabel ? label : undefined}
        onChange={(e) => {
          e.preventDefault();
          return onChange?.(e.target.value);
        }}
      />
      <span className={"w-full"}>{value}</span>
      <input
        step={0.01}
        id={`${id}-alpha`}
        type="number"
        defaultValue={alpha}
        onChange={(e) => {
          e.preventDefault();
          return onChangeAlpha?.(parseFloat(e.target.value));
        }}
        className={"pl-1 w-full group-hover:border-l group-hover:border-base-content/20"}
      />
    </div>
  );
};
