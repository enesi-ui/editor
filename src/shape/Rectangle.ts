import {
  Application,
  Container,
  FederatedPointerEvent,
  Graphics,
} from "pixi.js";
import { CanvasShape, Shape } from "~/shape/CanvasShape.ts";
import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { roundNumber } from "~/utility/round.ts";
import { CanvasObject } from "~/canvas/CanvasObject.ts";
import { CanvasObjectSelectMove } from "~/shape/CanvasObjectSelectMove.ts";
import { FillPropertyData } from "~/properties-panel/FillPropertyData.ts";
import { isValidHexCode } from "~/utility/hex.ts";

export class Rectangle implements CanvasShape {
  private readonly graphics: Graphics;
  private readonly selectGraphics: Graphics;
  private readonly highlight: Graphics;
  private readonly container: Container;
  private strokes: StrokePropertyData[] = [];
  private fills: FillPropertyData[] = [];
  private currentStrokes: Graphics[] = [];
  private readonly handles: Graphics[] = [];
  private radiusHandle: Graphics;
  private selected = false;
  private initFill = "#ffffff";
  private initFillAlpha = 1;
  private highlightColor = "#c792e9";
  private highlightWidth = 2;
  private handlesColor = "#c792e9";
  private handleFill = "#ffffff";
  private handlesWidth = 1;
  private handleSize = 8;
  private radiusHandleSize = 4;
  private radiusHandlePosition = 12;
  private highlighted = false;
  private radius = 0;
  public readonly id: string | undefined;
  constructor(
    origin: { x: number; y: number },
    readonly app: Application,
    private options?: {
      onSelect: (canvasObject: CanvasObject) => void;
      onUpdate?: (shape: Shape) => Promise<unknown>;
      data?: Shape;
    },
  ) {
    this.container = app.stage.addChild(new Container());
    this.container.eventMode = "static";
    this.container.sortableChildren = true;
    this.container.x = origin.x;
    this.container.y = origin.y;

    this.fills = [
      {
        color: this.initFill,
        alpha: this.initFillAlpha,
      },
    ];
    this.graphics = this.container.addChild(
      new Graphics()
        .beginFill(this.initFill, this.initFillAlpha)
        .drawRect(0, 0, 0, 0)
        .endFill(),
    );
    this.graphics.zIndex = 1;

    this.highlight = new Graphics()
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawRect(0, 0, 0, 0)
      .endFill();
    this.highlight.zIndex = 2;

    this.selectGraphics = new Graphics()
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawRect(0, 0, 0, 0)
      .endFill();
    this.selectGraphics.zIndex = 2;

    this.createHandles();

    this.radiusHandle = new Graphics()
    this.createRadiusHandles();

    if (options?.data) {
      this.init(options.data);
      this.id = options.data.id;
    }

    new CanvasObjectSelectMove(app, this);
  }

  private createHandles() {
    for (let i = 0; i < 4; i++)
      this.handles.push(
        new Graphics()
          .clear()
          .lineStyle(this.handlesWidth, this.handlesColor)
          .drawRect(0, 0, 0, 0)
          .endFill(),
      );

    this.handles.forEach((handle) => {
      handle.zIndex = 3;
    });

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

  private createRadiusHandles() {
    this.radiusHandle = new Graphics()
      .clear()
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawCircle(0, 0, 0.1)
      .endFill();
    this.radiusHandle.zIndex = 4;

    this.radiusHandle.cursor = "crosshair";
    this.radiusHandle.eventMode = "static";
    this.radiusHandle.on("pointerdown", (downEvent) => {
      downEvent.stopPropagation();
      const { x: xDown, y: yDown } = downEvent.global;
      const initialRadius = this.radius;
      const resize = (event: FederatedPointerEvent) =>
        this.resizeRadiusHandle({ xDown, yDown, initialRadius }, event);
      this.app.stage.on("pointermove", resize);
      this.radiusHandle.once("pointerupoutside", () => {
        this.app.stage.off("pointermove", resize);
      });
    });
  }

  private init(data: Omit<Shape, "id" | "container">) {
    this.fills = data.fills;
    this.radius = data.radius;
    this.setGraphics(this.fills, data.graphics.width, data.graphics.height);
    this.setStrokes(data.strokes);
    this.updateGuides();
  }

  getFill(): FillPropertyData[] {
    return this.fills;
  }

  getStroke(): StrokePropertyData[] {
    return this.strokes;
  }

  resizeHandle1 = async (event: FederatedPointerEvent) => {
    const { x: localX } = this.container.toLocal(event.global);
    const { height } = this.getSize();

    const pointerY = event.global.y;

    const { x, y } = this.getOrigin();
    this.setSizeOrigin(x, pointerY, localX, height - pointerY + y, true);
    this.setStrokes(this.strokes);
    if (this.id)
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  };

  resizeHandle2 = (event: FederatedPointerEvent) => {
    const { y: localY } = this.container.toLocal(event.global);
    const { width } = this.getSize();

    const pointerX = event.global.x;
    const { x, y } = this.getOrigin();
    this.setSizeOrigin(pointerX, y, width - pointerX + x, localY, true);
    this.setStrokes(this.strokes);
  };

  resizeHandle3 = async (event: FederatedPointerEvent) => {
    const { x, y } = this.container.toLocal(event.global);

    this.setSize(x, y, true);
    this.setStrokes(this.strokes);
    if (this.id)
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  };

  resizeHandle0 = (event: FederatedPointerEvent) => {
    const pointerX = event.global.x;
    const pointerY = event.global.y;

    const { x, y } = this.getOrigin();
    const { width, height } = this.getSize();
    this.setSizeOrigin(
      pointerX,
      pointerY,
      width - pointerX + x,
      height - pointerY + y,
      true,
    );
    this.setStrokes(this.strokes);
    if (this.id)
      this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  };

  resizeRadiusHandle = (
    {
      xDown,
      yDown,
      initialRadius,
    }: { xDown: number; yDown: number; initialRadius: number },
    event: FederatedPointerEvent,
  ) => {
    const { width, height } = this.getSize();

    const { x, y } = event.global;
    const maxRadius = Math.min(width, height) / 2;
    const movement =
      Math.sqrt((x - xDown) ** 2 + (y - yDown) ** 2) * Math.sign(x - xDown);
    const newRadius =
      (movement * maxRadius) / (maxRadius - this.radiusHandlePosition) +
      initialRadius;
    this.radius = Math.max(0, Math.min(maxRadius, newRadius));
    this.graphics.clear();
    this.fills.forEach((fillProperty) => {
      const { color, alpha } = fillProperty;
      this.graphics
        .beginFill(color, alpha)
        .drawRoundedRect(0, 0, width, height, this.radius)
        .endFill();
    });
    this.updateGuides();
    if (this.id)
      this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  };

  private updateGuides() {
    this.highlight
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawRect(0, 0, this.graphics.width, this.graphics.height)
      .endFill();
    this.selectGraphics
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawRect(0, 0, this.graphics.width, this.graphics.height)
      .endFill();
    this.handles[0]
      .clear()
      .beginFill(this.handleFill)
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawRect(
        -this.handleSize / 2,
        -this.handleSize / 2,
        this.handleSize,
        this.handleSize,
      )
      .endFill();
    this.handles[1]
      .clear()
      .beginFill(this.handleFill)
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawRect(
        this.graphics.width - this.handleSize / 2,
        -this.handleSize / 2,
        this.handleSize,
        this.handleSize,
      )
      .endFill();
    this.handles[2]
      .clear()
      .beginFill(this.handleFill)
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawRect(
        -this.handleSize / 2,
        this.graphics.height - this.handleSize / 2,
        this.handleSize,
        this.handleSize,
      )
      .endFill();
    this.handles[3]
      .clear()
      .beginFill(this.handleFill)
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawRect(
        this.graphics.width - this.handleSize / 2,
        this.graphics.height - this.handleSize / 2,
        this.handleSize,
        this.handleSize,
      )
      .endFill();

    const maxRadius = Math.min(this.graphics.width, this.graphics.height) / 2;
    this.radiusHandle
      .clear()
      .beginFill(this.handleFill)
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawCircle(
        this.radiusHandlePosition * ((maxRadius - this.radius) / maxRadius) +
          this.radius,
        this.radiusHandlePosition * ((maxRadius - this.radius) / maxRadius) +
        this.radius,
        this.radiusHandleSize,
      )
      .endFill();
  }

  setOrigin(
    x: number,
    y: number,
    round: boolean = true,
    emit: boolean = false,
  ): void {
    this.container.x = round ? roundNumber(x) : x;
    this.container.y = round ? roundNumber(y) : y;
    if (emit && this.id)
      this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  setSize(
    width: number,
    height: number,
    round: boolean = true,
    emit: boolean = false,
  ): void {
    const roundedWidth = round ? roundNumber(width) : width;
    const roundedHeight = round ? roundNumber(height) : height;
    this.setGraphics(this.fills, roundedWidth, roundedHeight);
    this.updateGuides();
    if (emit && this.id)
      this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  setSizeOrigin(
    x: number,
    y: number,
    width: number,
    height: number,
    round?: boolean,
    emit?: boolean,
  ) {
    this.container.x = round ? roundNumber(x) : x;
    this.container.y = round ? roundNumber(y) : y;
    const roundedWidth = round ? roundNumber(width) : width;
    const roundedHeight = round ? roundNumber(height) : height;
    this.setGraphics(this.fills, roundedWidth, roundedHeight);
    this.updateGuides();
    if (emit && this.id)
      this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  setFill(fills: FillPropertyData[], emit: boolean = false) {
    this.fills = fills;
    const { width, height } = this.graphics;
    this.setGraphics(fills, width, height);

    if (emit && this.id)
      this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  setGraphics(fills: FillPropertyData[], width: number, height: number) {
    this.graphics.clear();
    fills.forEach((fillProperty) => {
      const { color, alpha } = fillProperty;
      const validColor = isValidHexCode(color) ? color : this.initFill;
      this.graphics
        .beginFill(validColor, alpha)
        .drawRoundedRect(0, 0, width, height, this.radius)
        .endFill();
    });
  }

  setStrokes(strokes: StrokePropertyData[], emit: boolean = false) {
    this.currentStrokes.map((currentStroke) =>
      this.container.removeChild(currentStroke),
    );
    strokes.forEach((strokeProperty) => {
      const { color, alpha } = strokeProperty;
      const validColor = isValidHexCode(color) ? color : this.initFill;
      const startCoordinate = strokeProperty.width / 2;
      const stroke = new Graphics()
        .lineStyle({
          color: validColor,
          alpha,
          width: strokeProperty.width,
        })
        .drawRoundedRect(
          startCoordinate,
          startCoordinate,
          this.graphics.width - strokeProperty.width,
          this.graphics.height - strokeProperty.width,
          this.radius,
        )
        .endFill();
      stroke.zIndex = 2;
      this.currentStrokes.push(this.container.addChild(stroke));
    });
    this.strokes = strokes;
    if (emit && this.id)
      this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  get width() {
    return this.container.width;
  }
  get height() {
    return this.container.height;
  }

  get x() {
    return this.container.x;
  }
  get y() {
    return this.container.y;
  }

  getSize(): { width: number; height: number, radius: number} {
    return {
      width: this.graphics.width,
      height: this.graphics.height,
      radius: this.radius,
    };
  }

  getOrigin(): { x: number; y: number } {
    return {
      x: this.container.x,
      y: this.container.y,
    };
  }

  public deselect() {
    if (!this.selected) return;
    this.container.removeChild(this.selectGraphics);
    this.container.removeChild(...this.handles);
    this.container.removeChild(this.radiusHandle);
    this.selected = false;
  }

  public select() {
    if (this.selected) return;
    this.container.addChild(this.selectGraphics);
    this.container.addChild(...this.handles);
    this.container.addChild(this.radiusHandle);
    this.options?.onSelect(this);
    this.selected = true;
  }

  public showHighlight() {
    if (this.highlighted) return;
    this.container.addChild(this.highlight);
    this.highlighted = true;
  }

  public hideHighlight() {
    if (!this.highlighted) return;
    this.container.removeChild(this.highlight);
    this.highlighted = false;
  }

  serialize(): Omit<Shape, "id"> {
    return {
      type: "RECTANGLE",
      container: {
        x: this.container.x,
        y: this.container.y,
        width: this.container.width,
        height: this.container.height,
      },
      graphics: {
        x: this.graphics.x,
        y: this.graphics.y,
        width: this.graphics.width,
        height: this.graphics.height,
      },
      strokes: this.strokes.map((stroke) => ({
        color: stroke.color,
        alpha: stroke.alpha,
        width: stroke.width,
      })),
      fills: this.fills,
      radius: this.radius,
    };
  }

  updateGraphics(data: Omit<Shape, "id">) {
    this.setSizeOrigin(
      data.container.x,
      data.container.y,
      data.container.width,
      data.container.height,
    );
    this.setFill(data.fills);
    this.setStrokes(data.strokes);
  }

  getImageData(): ImageData {
    const imageData = this.app.renderer.extract
      .canvas(this.graphics)
      .getContext("2d")
      ?.getImageData(0, 0, this.graphics.width, this.graphics.height);
    if (!imageData) throw new Error("Could not get image data");
    return imageData;
  }

  on(
    event: "pointerdown" | "pointerover" | "pointerout" | "pointerup",
    handler: (event: FederatedPointerEvent) => void,
  ) {
    this.container.on(event, handler);
  }

  once(
    event: "pointerdown" | "pointerover" | "pointerout" | "pointerup",
    handler: (event: FederatedPointerEvent) => void,
  ): void {
    this.container.once(event, handler);
  }


  off(
    event: "pointerdown" | "pointerover" | "pointerout",
    handler: (event: FederatedPointerEvent) => void,
  ) {
    this.container.off(event, handler);
  }

  clear() {
    this.container.destroy({ children: true });
  }

  createStyle(className: string): string {
    return `
      .${className} {
        position: absolute;
        top: ${this.container.y}px;
        left: ${this.container.x}px;
        width: ${this.graphics.width}px;
        height: ${this.graphics.height}px;
        background-color: ${this.fills[0].color};
        opacity: ${this.fills[0].alpha};
      }
    `;
  }
}
