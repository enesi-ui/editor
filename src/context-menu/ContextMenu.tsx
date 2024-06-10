import React, { useEffect } from "react";
import useWindowDimensions from "~/utility/use-window-dimensions.ts";

export type ContextMenuProps = {
  children: React.ReactNode;
  open: boolean;
  header?: string;
  onOutsideClick?: () => void;
  triggerElement?: HTMLElement;
  xOffset?: number;
  yOffset?: number;
};
export const ContextMenu = ({
                              open,
  children,
  triggerElement,
  header,
  onOutsideClick,
  xOffset,
  yOffset,
}: ContextMenuProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { width, height } = useWindowDimensions();

  const xOffSet = xOffset ?? 0;
  const yOffSet = yOffset ?? 0;

  useEffect(() => {
    if (!ref.current || !triggerElement || !open) return;
    const origin = triggerElement.getBoundingClientRect();
    const { width: divWith, height: divHeight } =
      ref.current.getBoundingClientRect();
    if (origin.x + divWith > width) {
      ref.current.style.left = `${width - divWith + xOffSet}px`;
    } else {
      ref.current.style.left = `${origin.x + xOffSet}px`;
    }
    if (origin.bottom + divHeight > height) {
      ref.current.style.top = `${height - divHeight + yOffSet}px`;
    } else {
      ref.current.style.top = `${origin.bottom + yOffSet}px`;
    }
  }, [xOffSet, yOffSet, width, height, ref, triggerElement, open, xOffset, yOffset]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !triggerElement?.contains(event.target as Node)
      ) {
        onOutsideClick?.();
      }
    }
    document.addEventListener("pointerup", handleClickOutside);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [ref, onOutsideClick, triggerElement]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className="fixed right-0 z-10 mt-2 w-56 origin-top-left bg-base-100 focus:outline-none shadow-xl border border-base-content/20 py-2"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      {header && <h2 className="text-sm p-2">{header}</h2>}
      {children}
    </div>
  );
};
