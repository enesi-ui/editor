import { MinusIcon } from "~/icon/MinusIcon.tsx";
import { HiddenIcon, VisibleIcon } from "~/icon/HideIcon.tsx";
import iro from "@jaames/iro";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContextMenu } from "~/context-menu/ContextMenu.tsx";
import { useContextMenu } from "~/context-menu/useContextMenu.ts";
import { addAlpha } from "~/utility/hex.ts";

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

  const { open, hide, triggerElement, toggle } = useContextMenu();
  const [colorPicker, setColorPicker] = useState<iro.ColorPicker>();
  const initialValue = useRef(addAlpha(value, alpha ?? 1));
  const hasAlpha = useRef(alpha !== undefined);

  const [internalAlphaValue, setInternalAlphaValue] = useState(
    alpha?.toString(),
  );

  const handleChange = (value: string) => {
    setInternalAlphaValue(value);
  };

  const ref = useCallback((colorPickerRef: HTMLElement | null) => {
    if (!colorPickerRef) return;
    const layout: {
      component: typeof iro.ui.Wheel | typeof iro.ui.Slider;
      options?: { [key: string]: unknown };
    }[] = [
      {
        component: iro.ui.Wheel,
        options: {
          wheelLightness: false,
        },
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "value",
        },
      },
    ];

    if (hasAlpha.current) {
      layout.push({
        component: iro.ui.Slider,
        options: {
          sliderType: "alpha",
        },
      });
    }

    setColorPicker(
      iro.ColorPicker(colorPickerRef, {
        color: initialValue.current,
        layout,
      }),
    );
  }, []);

  useEffect(() => {
    const handleChange = function (color: {
      hexString: string;
      alpha: number;
    }) {
      onChangeAlpha?.(color.alpha);
      onChange?.(color.hexString);
    };

    colorPicker?.on("input:change", handleChange);

    return () => {
      colorPicker?.off("input:change", handleChange);
    };
  }, [colorPicker, onChange, onChangeAlpha]);

  const cleanAlpha = (value?: string) => {
    const floatValue = parseFloat(value ?? "");

    return isNaN(floatValue) || floatValue < 0 || floatValue > 1
      ? alpha ?? 1
      : floatValue;
  };

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <ContextMenu
        open={open}
        onOutsideClick={hide}
        triggerElement={triggerElement}
        xOffset={-250}
      >
        <div className="p-2" ref={ref} />
      </ContextMenu>
      <div
        className={
          "input input-ghost input-sm flex items-center gap-2 group min-w-0 px-0"
        }
      >
        {showLabel && (
          <label className="pl-1" htmlFor={id}>
            {label}
          </label>
        )}
        <div
          style={{ backgroundColor: `${value}` }}
          className="flex-[0_0_24px] h-[24px] ml-2"
          onPointerDown={(event) => {
            toggle({
              x: event.pageX,
              y: event.pageY,
              triggerElement: event.currentTarget,
            });
          }}
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
          <input
            step={0.01}
            id={`${id}-alpha`}
            type="text"
            value={internalAlphaValue}
            min={0}
            onChange={(e) => {
              e.preventDefault();
              return handleChange(e.target.value);
            }}
            onBlur={(e) => {
              e.preventDefault();
              const cleanValue = cleanAlpha(internalAlphaValue);
              setInternalAlphaValue(cleanValue.toString());
              return onChangeAlpha?.(cleanValue);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                const cleanValue = cleanAlpha(internalAlphaValue);
                setInternalAlphaValue(cleanValue.toString());
                e.currentTarget.blur();
                return onChangeAlpha?.(cleanValue);
              }
            }}
            className={
              "pl-1 border-transparent border-l group-hover:border-base-content/20 min-w-0 w-full"
            }
          />
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
