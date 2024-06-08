import { useState } from "react";

export const useContextMenu = <T = undefined>() => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    show: boolean;
    triggerElement?: HTMLElement;
    data?: T;
  }>({ x: 0, y: 0, show: false });

  return {
    triggerElement: contextMenu.triggerElement,
    show: contextMenu.show,
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
      setContextMenu({ x, y, show: true, data, triggerElement });
    },
    hide: () => {
      setContextMenu({ x: 0, y: 0, show: false });
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
      if (contextMenu.show) {
        setContextMenu({ x: 0, y: 0, show: false });
      } else {
        setContextMenu({ x, y, show: true, data, triggerElement });
      }
    },
  };
};
