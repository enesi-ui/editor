import { usePixi } from "~/pixi/pixiContext.ts";
import { FederatedPointerEvent } from "pixi.js";
import { CanvasShape } from "~/shape/CanvasShape.ts";
import { Rectangle } from "./Rectangle.ts";
import { ContextMenu } from "~/context-menu/ContextMenu.tsx";
import { SelectableContextMenuItem } from "~/context-menu/SelectableContextMenuItem.tsx";
import React, { useState } from "react";
import { RectangleIcon } from "~/icon/RectangleIcon.tsx";
import { ChevronIcon } from "~/icon/ChevronIcon.tsx";
import { EllipseIcon } from "~/icon/EllipseIcon.tsx";
import { Ellipse } from "~/shape/Ellipse.ts";
import { useToolsContext } from "~/tool/useToolsContext.ts";
import { Tools } from "~/tool/Tools.ts";
import { CanvasShapeCompletionTracker } from "~/shape/CanvasShapeCompletionTracker.ts";
import { useContextMenu } from "~/context-menu/useContextMenu.ts";
import { useShapesPost } from "~/shape/useShapesPost.ts";

export type FactoryClassType = typeof Rectangle | typeof Ellipse;

interface Factory {
  label: "Rectangle" | "Ellipse";
  icon: React.ReactElement;
  class: FactoryClassType;
}

const factories: Factory[] = [
  {
    label: "Rectangle",
    icon: <RectangleIcon />,
    class: Rectangle,
  },
  {
    label: "Ellipse",
    icon: <EllipseIcon />,
    class: Ellipse,
  },
];

export const ShapeFactory = () => {
  const app = usePixi();

  const { tool, setTool } = useToolsContext();

  const { post } = useShapesPost();

  const { hide, open, set, triggerElement } = useContextMenu();

  const create = (factory: Factory, createdEvent: FederatedPointerEvent) => {
    if (tool.current !== Tools.CREATE_SHAPE) return;

    const shape = new factory.class(createdEvent.global, app);
    const handleFinished = async (shape: CanvasShape) => {
      await post(shape.serialize());
      // NOTE: the preliminary shape is removed from the canvas and
      // the shape is added to the canvas from the updates received from the server
      // the timeout is a temporary solution to prevent the flash of the shape due to the delay in the server response
      setTimeout(() => {
        shape.clear();
      }, 300);
    };
    new CanvasShapeCompletionTracker(app, shape, handleFinished);
  };

  const handleClick = (factory: Factory) => {
    setTool(Tools.CREATE_SHAPE);

    app.stage.removeAllListeners("pointerdown");
    app.stage.on("pointerdown", (event) => create(factory, event));
  };

  const [activeFactory, setFactory] = useState<Factory>(factories[0]);

  const activeClass = `${
    tool.current === Tools.CREATE_SHAPE ? "bg-accent" : "bg-neutral"
  }`;

  const contextButtonClass = `${
    tool.current === Tools.CREATE_SHAPE ? "text-neutral": "text-neutral-content"
  }`;

  const buttonClass = `${
    tool.current === Tools.CREATE_SHAPE ? "bg-accent btn-accent" : "bg-neutral"
  }`;

  return (
    <div className={`join ${activeClass}`}>
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
          set({
            x: event.pageX,
            y: event.pageY,
            triggerElement: event.currentTarget,
          });
        }}
      >
        <ChevronIcon className={`h-full flex pointer-events-none ${contextButtonClass}`} />
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
