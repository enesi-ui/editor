import { MinusIcon } from "~/icon/MinusIcon.tsx";
import { HiddenIcon, VisibleIcon } from "~/icon/HideIcon.tsx";

interface ColorPropertyProps {
  label: string;
  value: string;
  alpha?: number;
  id: string;
  onChange?: (value: string) => void;
  onChangeAlpha?: (value: number) => void;
  showLabel?: boolean;
  className?: string;
  onRemove?: () => void;
  onToggleVisibility?: () => void;
  hidden?: boolean;
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
    onRemove,
    onToggleVisibility,
    hidden,
  } = props;

  return (
    <div
      className={`flex items-center justify-between w-full pr-3 ${className}`}
    >
      <div
        className={
          "input input-ghost input-sm flex items-center gap-2 group min-w-0 pr-0"
        }
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
          className="flex-[0_0_24px]"
        />
        <input
          autoComplete={"false"}
          spellCheck={"false"}
          dir={"auto"}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            return onChange?.(
              e.target.value[0] !== "#" ? `#${e.target.value}` : e.target.value,
            );
          }}
          className="flex-[0_1_64px] min-w-0 prose-xs"
        />

        <label
          className="flex-[0_1_48px] min-w-0 pl-1"
          aria-label={`fill ${id} Opacity`}
        >
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
                "pl-1 border-transparent border-l group-hover:border-base-content/20 min-w-0 w-full"
              }
            />
          )}
        </label>
      </div>
      {onToggleVisibility && (
        <button
          onClick={onToggleVisibility}
          className="btn btn-ghost btn-sm btn-square p-1 hover:bg-base-content/20 flex items-center justify-center"
        >
          {hidden ? <HiddenIcon /> : <VisibleIcon />}
        </button>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="btn btn-ghost btn-sm btn-square p-1 hover:bg-base-content/20 flex items-center justify-center"
        >
          <MinusIcon />
        </button>
      )}
    </div>
  );
};
