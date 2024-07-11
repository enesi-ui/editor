import { useContextMenu } from "~/context-menu/useContextMenu.ts";
import { ContextMenu } from "~/context-menu/ContextMenu.tsx";
import { PropsWithChildren, useEffect } from "react";

interface Prop {
  triggerElement: HTMLElement;
}

export const UnControlledContextMenu = ({ children, triggerElement }: PropsWithChildren<Prop>) => {
  const { open, hide, set } = useContextMenu();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) =>{
      set({
        x: event.pageX,
        y: event.pageY,
        triggerElement,
      });
    }
    triggerElement.addEventListener("pointerdown", handlePointerDown)

    return () => {
      triggerElement.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [set, triggerElement]);

  return (
    <ContextMenu
      open={open}
      onOutsideClick={hide}
      triggerElement={triggerElement}
    >
      {children}
    </ContextMenu>
  );
};
