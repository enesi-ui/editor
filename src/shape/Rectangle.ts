import {
  Application,
  Container,
  FederatedPointerEvent,
  Graphics,
} from "pixi.js";
import { CanvasShape, Shape } from "~/shape/CanvasShape.ts";
import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { roundNumber } from "~/utility/round.ts";
import { CanvasObjectSelectMove } from "~/shape/CanvasObjectSelectMove.ts";
import { isValidHexCode } from "~/utility/hex.ts";
import { ResizeHandles } from "~/shape/ResizeHandles.ts";

export class Rectangle implements CanvasShape {
  private readonly graphics: Graphics;
  private readonly selectGraphics: Graphics;
  private readonly highlight: Graphics;
  private readonly container: Container;
  private readonly resizeHandles: ResizeHandles;
  private currentStrokes: Graphics[] = [];
  private radiusHandle: Graphics;
  private initFill = "#ffffff";
  private initFillAlpha = 1;
  private highlightColor = "#c792e9";
  private highlightWidth = 2;
  private handlesColor = "#c792e9";
  private handleFill = "#ffffff";
  private handlesWidth = 1;
  private radiusHandleSize = 4;
  private radiusHandlePosition = 12;
  get id() {
    return this.data.id;
  }

  get canvasId() {
    return this.data.canvas;
  }

  constructor(
    origin: { x: number; y: number },
    private readonly app: Application,
    private readonly data: Shape,
    private options?: {
      onSelect: (shapeId: string) => void;
      onUpdate?: (shape: Shape) => unknown;
    },
  ) {
    this.container = app.stage.addChild(new Container());
    this.container.zIndex = data.zIndex;
    this.container.eventMode = "static";
    this.container.sortableChildren = true;
    this.container.x = origin.x;
    this.container.y = origin.y;

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
    this.highlight.visible = false;
    this.container.addChild(this.highlight);

    this.selectGraphics = new Graphics()
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawRect(0, 0, 0, 0)
      .endFill();
    this.selectGraphics.zIndex = 2;
    this.selectGraphics.visible = false;
    this.container.addChild(this.selectGraphics);

    this.resizeHandles = new ResizeHandles(app, this, (x, y, width, height) => {
      this.setSizeOrigin(roundNumber(x), roundNumber(y), roundNumber(width), roundNumber(height));
      if (this.id) this.options?.onUpdate?.(this.serialize());
    });
    this.resizeHandles.attach(this.container);

    this.radiusHandle = new Graphics();
    this.createRadiusHandles();

    this.setGraphics(this.data.graphics.width, this.data.graphics.height);
    this.setStrokes(this.data.strokes);
    this.updateGuides();

    new CanvasObjectSelectMove(app, this, (x, y) => {
      this.container.x = roundNumber(x);
      this.container.y = roundNumber(y);
      if (this.id) this.options?.onUpdate?.(this.serialize());
    });
  }

  private createRadiusHandles() {
    this.radiusHandle = new Graphics()
      .clear()
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawCircle(0, 0, this.radiusHandleSize)
      .endFill();
    this.radiusHandle.zIndex = 4;

    this.radiusHandle.cursor = "crosshair";
    this.radiusHandle.eventMode = "static";
    this.radiusHandle.on("pointerdown", (downEvent) => {
      downEvent.stopPropagation();
      const { x: xDown, y: yDown } = downEvent.global;
      const initialRadius = this.data.radius;
      const resize = (event: FederatedPointerEvent) =>
        this.resizeRadiusHandle({ xDown, yDown, initialRadius }, event);
      this.app.stage.on("pointermove", resize);
      this.radiusHandle.once("pointerupoutside", () => {
        this.app.stage.off("pointermove", resize);
      });
    });
    this.radiusHandle.visible = false;
    this.container.addChild(this.radiusHandle);
  }

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
    this.data.radius = roundNumber(Math.max(0, Math.min(maxRadius, newRadius)));
    this.graphics.clear();
    this.data.fills.forEach((fillProperty) => {
      const { color, alpha } = fillProperty;
      this.graphics
        .beginFill(color, alpha)
        .drawRoundedRect(0, 0, width, height, this.data.radius)
        .endFill();
    });
    this.updateGuides();
    if (this.id) this.options?.onUpdate?.(this.serialize());
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

    this.resizeHandles.resize(this.graphics.width, this.graphics.height);

    const maxRadius = Math.min(this.graphics.width, this.graphics.height) / 2;
    this.radiusHandle
      .clear()
      .beginFill(this.handleFill)
      .lineStyle(this.handlesWidth, this.handlesColor)
      .drawCircle(
        this.radiusHandlePosition *
          ((maxRadius - this.data.radius) / maxRadius) +
          this.data.radius,
        this.radiusHandlePosition *
          ((maxRadius - this.data.radius) / maxRadius) +
          this.data.radius,
        this.radiusHandleSize,
      )
      .endFill();
  }

  private setSizeOrigin(
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.container.x = x;
    this.container.y = y;
    this.setGraphics(width, height);
    this.setStrokes(this.data.strokes);
    this.updateGuides();
  }

  private setGraphics(
    width: number,
    height: number,
  ) {
    this.graphics.clear();
    if (this.data.fills.length === 0) {
      this.graphics
        .beginFill('#ffffff', 0.000000001)
        .drawRoundedRect(0, 0, width, height, this.data.radius)
        .endFill();
      return;
    }
    this.data.fills.forEach((fillProperty) => {
      const { color, alpha } = fillProperty;
      const validColor = isValidHexCode(color) ? color : this.initFill;
      this.graphics
        .beginFill(validColor, alpha)
        .drawRoundedRect(0, 0, width, height, this.data.radius)
        .endFill();
    });
  }

  private setStrokes(strokes: StrokePropertyData[]) {
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
          this.data.radius,
        )
        .endFill();
      stroke.zIndex = 3;
      this.currentStrokes.push(this.container.addChild(stroke));
    });
  }

  getSize(): { width: number; height: number; radius: number } {
    return {
      width: this.graphics.width,
      height: this.graphics.height,
      radius: this.data.radius,
    };
  }

  getOrigin(): { x: number; y: number } {
    return {
      x: this.container.x,
      y: this.container.y,
    };
  }

  public deselect() {
    if (!this.selectGraphics.visible) return;
    this.resizeHandles.hide();
    this.radiusHandle.visible = false;
    this.selectGraphics.visible = false;
  }

  public select() {
    if (this.selectGraphics.visible) return;
    this.resizeHandles.show();
    this.radiusHandle.visible = true;
    this.options?.onSelect(this.id);
    this.selectGraphics.visible = true;
  }

  public showHighlight() {
    if (this.highlight.visible) return;
    this.highlight.visible = true;
  }

  public hideHighlight() {
    if (!this.highlight.visible) return;
    this.highlight.visible = false;
  }

  public serialize(): Shape {
    return {
      id: this.data.id,
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
      strokes: this.data.strokes.map((stroke) => ({
        color: stroke.color,
        alpha: stroke.alpha,
        width: stroke.width,
      })),
      fills: this.data.fills,
      radius: this.data.radius,
      zIndex: this.data.zIndex,
      name: this.data.name,
      canvas: this.data.canvas,
    };
  }

  update(data: Omit<Shape, "id">) {
    this.data.name = data.name;
    this.data.zIndex = data.zIndex;
    this.data.fills = data.fills;
    this.data.strokes = data.strokes;
    this.data.radius = data.radius;
    this.data.container = data.container;
    this.data.graphics = data.graphics;

    this.container.zIndex = data.zIndex;
    this.setSizeOrigin(
      data.container.x,
      data.container.y,
      data.graphics.width,
      data.graphics.height,
    );
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

  public createStyle(className: string): string {
    return `
      .${className} {
        position: absolute;
        top: ${this.container.y}px;
        left: ${this.container.x}px;
        width: ${this.graphics.width}px;
        height: ${this.graphics.height}px;
        background-color: ${this.data.fills[0].color};
        opacity: ${this.data.fills[0].alpha};
      }
    `;
  }
}
