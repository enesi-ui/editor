import {
  Graphics,
  FederatedPointerEvent,
  Application,
  Container,
} from "pixi.js";
import { CanvasShape } from "~/shape/CanvasShape.ts";

export class ResizeHandles {
  private readonly handles: Graphics[] = [];
  constructor(
    private readonly app: Application,
    private readonly shape?: CanvasShape,
    private readonly onResize?: (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => void,
    private readonly options: {
      handleSize: number;
      handleFill: string;
      handlesWidth: number;
      handlesColor: string;
      zIndex: number;
    } = {
      handleSize: 8,
      handleFill: "#ffffff",
      handlesWidth: 1,
      handlesColor: "#c792e9",
      zIndex: 4,
    },
  ) {
    const { handlesWidth, handlesColor } = this.options;
    for (let i = 0; i < 4; i++)
      this.handles.push(
        new Graphics()
          .clear()
          .lineStyle(handlesWidth, handlesColor)
          .drawRect(0, 0, 0, 0)
          .endFill(),
      );

    this.handles.forEach((handle) => {
      handle.zIndex = this.options.zIndex;
    });

    this.hide();

    if (this.onResize) this.subscribe();
  }

  resize(width: number, height: number) {
    const { handleSize, handleFill, handlesWidth, handlesColor } = this.options;
    this.handles[0]
      .clear()
      .beginFill(handleFill)
      .lineStyle(handlesWidth, handlesColor)
      .drawRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize)
      .endFill();

    this.handles[1]
      .clear()
      .beginFill(handleFill)
      .lineStyle(handlesWidth, handlesColor)
      .drawRect(width - handleSize / 2, -handleSize / 2, handleSize, handleSize)
      .endFill();

    this.handles[2]
      .clear()
      .beginFill(handleFill)
      .lineStyle(handlesWidth, handlesColor)
      .drawRect(
        -handleSize / 2,
        height - handleSize / 2,
        handleSize,
        handleSize,
      )
      .endFill();

    this.handles[3]
      .clear()
      .beginFill(handleFill)
      .lineStyle(handlesWidth, handlesColor)
      .drawRect(
        width - handleSize / 2,
        height - handleSize / 2,
        handleSize,
        handleSize,
      )
      .endFill();
  }

  public hide = () => {
    this.handles.forEach((handle) => {
      handle.visible = false;
    });
  };

  public show = () => {
    this.handles.forEach((handle) => {
      handle.visible = true;
    });
  };

  private subscribe() {
    this.handles[0].cursor = "nwse-resize";
    this.handles[0].eventMode = "static";
    this.handles[0].on("pointerdown", (event) => {
      event.stopPropagation();
      this.app.stage.on("pointermove", this.resizeHandle0);
      this.handles[0].once("pointerup", () => {
        this.app.stage.off("pointermove", this.resizeHandle0);
      });
    });

    this.handles[1].cursor = "nesw-resize";
    this.handles[1].eventMode = "static";
    this.handles[1].on("pointerdown", (event) => {
      event.stopPropagation();
      this.app.stage.on("pointermove", this.resizeHandle1);
      this.handles[1].once("pointerup", () => {
        this.app.stage.off("pointermove", this.resizeHandle1);
      });
    });

    this.handles[2].cursor = "nesw-resize";
    this.handles[2].eventMode = "static";
    this.handles[2].on("pointerdown", (event) => {
      event.stopPropagation();
      this.app.stage.on("pointermove", this.resizeHandle2);
      this.handles[2].once("pointerup", () => {
        this.app.stage.off("pointermove", this.resizeHandle2);
      });
    });

    this.handles[3].cursor = "nwse-resize";
    this.handles[3].eventMode = "static";
    this.handles[3].on("pointerdown", (event) => {
      event.stopPropagation();
      this.app.stage.on("pointermove", this.resizeHandle3);
      this.handles[3].once("pointerup", () => {
        this.app.stage.off("pointermove", this.resizeHandle3);
      });
    });
  }

  resizeHandle0 = (event: FederatedPointerEvent) => {
    if (!this.shape) return;
    const pointerX = event.global.x;
    const pointerY = event.global.y;
    const { x, y } = this.shape.getOrigin();
    const { width, height } = this.shape.getSize();

    this.onResize?.(
      pointerX,
      pointerY,
      width - pointerX + x,
      height - pointerY + y,
    );
  };

  resizeHandle1 = async (event: FederatedPointerEvent) => {
    if (!this.shape) return;

    const localX = event.global.x - this.shape.getOrigin().x;
    const pointerY = event.global.y;
    const { height } = this.shape.getSize();

    const { x, y } = this.shape.getOrigin();

    this.onResize?.(x, pointerY, localX, height - pointerY + y);
  };

  resizeHandle2 = (event: FederatedPointerEvent) => {
    if (!this.shape) return;

    const localY = event.global.y - this.shape.getOrigin().y;
    const { width } = this.shape.getSize();
    const { x, y } = this.shape.getOrigin();
    const pointerX = event.global.x;

    this.onResize?.(pointerX, y, width - pointerX + x, localY);
  };

  resizeHandle3 = async (event: FederatedPointerEvent) => {
    if (!this.shape) return;
    const width = event.global.x - this.shape.getOrigin().x;
    const height = event.global.y - this.shape.getOrigin().y;

    const { x, y } = this.shape.getOrigin();

    this.onResize?.(x, y, width, height);
  };

  attach(container: Container) {
    container.addChild(...this.handles);
  }
}
