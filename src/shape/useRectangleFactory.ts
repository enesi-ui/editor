import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { Shape } from "~/shape/CanvasShape.ts";
import { isValidHexCode } from "~/utility/hex.ts";
import { useSelection } from "~/canvas/useSelection.ts";
import { usePixi } from "~/pixi/pixiContext.ts";
import { Rectangle } from "~/shape/Rectangle.ts";
import { useShapesPost } from "~/shape/useShapesPost.ts";
import { useShapeUpdate } from "~/shape/useShapeUpdate.ts";
import { canvasShapeStore } from "~/canvas/CanvasShapeStore.ts";
import { ResizeHandles } from "~/shape/ResizeHandles.ts";
import { roundNumber } from "~/utility/round.ts";

const createGuides = (container: Container) => {
  const highlightColor = "#c792e9";
  const highlightWidth = 2;

  const highlight = new Graphics()
    .clear()
    .lineStyle(highlightWidth, highlightColor)
    .drawRect(0, 0, 0, 0)
    .endFill();
  highlight.zIndex = 2;

  const selectGraphics = new Graphics()
    .clear()
    .lineStyle(highlightWidth, highlightColor)
    .drawRect(0, 0, 0, 0)
    .endFill();
  selectGraphics.zIndex = 2;

  container.addChild(highlight);
  container.addChild(selectGraphics);

  return { highlight, selectGraphics };
};
const renderGuides = (
  graphics: Graphics,
  highlight: Graphics,
  selectGraphics: Graphics,
  handles: ResizeHandles,
) => {
  const highlightColor = "#c792e9";
  const highlightWidth = 2;

  highlight
    .clear()
    .lineStyle(highlightWidth, highlightColor)
    .drawRect(0, 0, graphics.width, graphics.height)
    .endFill();
  highlight.zIndex = 2;

  selectGraphics
    .clear()
    .lineStyle(highlightWidth, highlightColor)
    .drawRect(0, 0, graphics.width, graphics.height)
    .endFill();
  selectGraphics.zIndex = 2;

  handles.resize(graphics.width, graphics.height);
};

export const useRectangleFactory = (canvasId: string) => {
  const app = usePixi();

  const initFill = "#ffffff";
  const initFillAlpha = 1;

  const { deselectAllSelect } = useSelection(canvasId);

  const { post } = useShapesPost();

  const { update } = useShapeUpdate();

  const store = canvasShapeStore();

  const handleFinished = async (shape: Omit<Shape, "id">) => {
    const newShape = await post(shape);
    const rectangle = new Rectangle(newShape.container, app, newShape, {
      onSelect: deselectAllSelect,
      onUpdate: update,
    });
    rectangle.select();
    store.current.add(rectangle);
  };

  const create = (origin: { x: number; y: number }) => {
    const container = new Container();
    container.width = 0;
    container.height = 0;
    app.stage.addChild(container);
    container.eventMode = "static";
    container.sortableChildren = true;
    container.x = origin.x;
    container.y = origin.y;
    const { x, y } = container;

    const graphics = container.addChild(
      new Graphics()
        .beginFill(initFill, initFillAlpha)
        .drawRect(0, 0, 0, 0)
        .endFill(),
    );
    graphics.zIndex = 1;

    const { highlight, selectGraphics } = createGuides(container);

    const handles = new ResizeHandles(app);
    handles.attach(container);
    handles.show();

    const move = (event: FederatedPointerEvent) => {
      const pointer = event.global;
      const pointerX = pointer.x;
      const pointerY = pointer.y;

      const isInvertedX = pointerX < x;
      const isInvertedY = pointerY < y;

      container.x = isInvertedX ? pointerX : x;
      container.y = isInvertedY ? pointerY : y;

      const roundedWidth = roundNumber(Math.abs(pointerX - x));
      const roundedHeight = roundNumber(Math.abs(pointerY - y));

      graphics.clear();
      const validColor = isValidHexCode(initFill) ? initFill : initFill;
      graphics
        .beginFill(validColor, initFillAlpha)
        .drawRect(0, 0, roundedWidth, roundedHeight)
        .endFill();

      renderGuides(graphics, highlight, selectGraphics, handles);
    };

    app.stage.on("pointermove", move);

    const up = async () => {
      app.stage.off("pointermove", move);
      if (graphics.width < 1 || graphics.height < 1)
        return graphics.destroy({ children: true });

      await handleFinished({
        type: "RECTANGLE",
        container: {
          x: roundNumber(container.x),
          y: roundNumber(container.y),
          width: container.width,
          height: container.height,
        },
        graphics: {
          x: graphics.x,
          y: graphics.y,
          width: graphics.width,
          height: graphics.height,
        },
        strokes: [],
        fills: [
          {
            color: initFill,
            alpha: initFillAlpha,
          },
        ],
        canvas: canvasId,
        zIndex: container.zIndex,
        radius: 0,
        name: "New Rectangle",
      });
      container.destroy({ children: true });
    };

    app.stage.once("pointerup", up);
  };

  return {
    subscribe: () => {
      const handlePointerDown = (event: FederatedPointerEvent) => {
        create(event.global);
      };

      app.stage.removeAllListeners("pointerdown");
      app.stage.on("pointerdown", handlePointerDown);
    },
  };
};
