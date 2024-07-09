import { ContextMenu } from "~/context-menu/ContextMenu.tsx";
import { SelectableContextMenuItem } from "~/context-menu/SelectableContextMenuItem.tsx";
import React, { useState } from "react";
import { RectangleIcon } from "~/icon/RectangleIcon.tsx";
import { ChevronIcon } from "~/icon/ChevronIcon.tsx";
import { EllipseIcon } from "~/icon/EllipseIcon.tsx";
import { useToolsContext } from "~/tool/useToolsContext.ts";
import { Tools } from "~/tool/Tools.ts";
import { useContextMenu } from "~/context-menu/useContextMenu.ts";
import { useRectangleFactory } from "~/shape/useRectangleFactory.ts";

interface Factory {
  label: "Rectangle" | "Ellipse";
  icon: React.ReactElement;
}

const factories: Factory[] = [
  {
    label: "Rectangle",
    icon: <RectangleIcon />,
  },
  {
    label: "Ellipse",
    icon: <EllipseIcon />,
  },
];

export const CreateShape = ({ canvasId }: { canvasId: string }) => {
  const { tool, setTool } = useToolsContext();

  const { hide, open, toggle, triggerElement } = useContextMenu();

  const { subscribe } = useRectangleFactory(canvasId);

  const handleClick = (factory: Factory) => {
    console.log("CreateShape handleClick", factory);
    setTool(Tools.CREATE_SHAPE);
    subscribe();
  };

  const [activeFactory, setFactory] = useState<Factory>(factories[0]);

  const activeClass = `${
    tool.current === Tools.CREATE_SHAPE ? "bg-accent" : "bg-neutral"
  }`;

  const contextButtonClass = `${
    tool.current === Tools.CREATE_SHAPE
      ? "text-neutral"
      : "text-neutral-content"
  }`;

  const buttonClass = `${
    tool.current === Tools.CREATE_SHAPE ? "bg-accent btn-accent" : "bg-neutral"
  }`;

  return (
    <div className={`join ${activeClass} mx-2`}>
      <button
        className={`btn btn-square join-item ${buttonClass}`}
        onClick={() => {
          handleClick(activeFactory);
        }}
        aria-label="Shape Tools"
        role="button"
        tabIndex={0}
      >
        {activeFactory.icon}
      </button>
      <span
        className={`w-4 flex pt-0 hover:pt-2 cursor-context-menu join-item justify-center`}
        onPointerDown={(event) => {
          toggle({
            x: event.pageX,
            y: event.pageY,
            triggerElement: event.currentTarget,
          });
        }}
      >
        <ChevronIcon
          className={`h-full flex pointer-events-none ${contextButtonClass}`}
        />
      </span>
      <ContextMenu
        open={open}
        onOutsideClick={hide}
        triggerElement={triggerElement}
      >
        {factories.map((factory) => (
          <SelectableContextMenuItem
            key={factory.label}
            label={factory.label}
            icon={factory.icon}
            onClick={() => {
              hide();
              handleClick(factory);
              setFactory(factory);
            }}
            active={activeFactory.label === factory.label}
          />
        ))}
      </ContextMenu>
    </div>
  );
};
