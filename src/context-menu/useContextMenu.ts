import { useState } from "react";

export const useContextMenu = <T = undefined>() => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    open: boolean;
    triggerElement?: HTMLElement;
    data?: T;
  }>({ x: 0, y: 0, open: false });

  return {
    triggerElement: contextMenu.triggerElement,
    open: contextMenu.open,
    position: { x: contextMenu.x, y: contextMenu.y },
    data: contextMenu.data,
    set: ({
      x,
      y,
      data,
      triggerElement,
    }: {
      x: number;
      y: number;
      data?: T;
      triggerElement?: HTMLElement;
    }) => {
      setContextMenu({ x, y, open: true, data, triggerElement });
    },
    hide: () => {
      setContextMenu({ x: 0, y: 0, open: false });
    },
    toggle: ({
      x,
      y,
      data,
      triggerElement,
    }: {
      x: number;
      y: number;
      data?: T;
      triggerElement: HTMLElement;
    }) => {
      if (contextMenu.open) {
        setContextMenu({ x: 0, y: 0, open: false });
      } else {
        setContextMenu({ x, y, open: true, data, triggerElement });
      }
    },
  };
};
