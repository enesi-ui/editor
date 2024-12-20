import {
  Application,
  Container,
  FederatedPointerEvent,
  Graphics,
} from "pixi.js";
import { CanvasShape, Shape } from "~/shape/CanvasShape.ts";
import { StrokePropertyData } from "~/properties-panel/StrokePropertyData.ts";
import { CanvasObject } from "~/canvas/CanvasObject.ts";
import { CanvasObjectSelectMove } from "~/shape/CanvasObjectSelectMove.ts";
import { FillPropertyData } from "~/properties-panel/FillPropertyData.ts";
import { roundNumber } from "~/utility/round.ts";

// todo: implement optimizations as in Rectangle.ts
export class Ellipse implements CanvasShape {
  private readonly highlight: Graphics;
  private readonly graphics: Graphics;
  private readonly container: Container;
  private selected = false;
  private fill = "#ffffff";
  private fillAlpha = 1;
  private highlightColor = "#0f79fb";
  private highlightWidth = 2;
  private highlighted = false;

  private fills: FillPropertyData[] = [];

  get id(): string {
    return "id";
  }
  get name(): string | undefined {
    return "Ellipse";
  }
  get canvasId(): string {
    return "canvasId";
  }

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

    this.graphics = this.container.addChild(
      new Graphics()
        .beginFill(this.fill, this.fillAlpha)
        .drawEllipse(0, 0, 0, 0)
        .endFill(),
    );

    this.highlight = new Graphics()
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawEllipse(0, 0, 0, 0)
      .endFill();

    if (options?.data) {
      this.init(options?.data);
    }
    new CanvasObjectSelectMove(app, this, (x, y) => {
      this.container.x = roundNumber(x)
      this.container.y = roundNumber(y)
      if (this.id) this.options?.onUpdate?.(this.serialize());
    });
  }

  get zIndex() {
    return this.container.zIndex;
  }

  async update(data: Shape): Promise<void> {
    this.setSizeOrigin(
      data.container.x,
      data.container.y,
      data.container.width,
      data.container.height,
    );
    this.setFill(data.fills);
    this.setStrokes(data.strokes);
  }

  getOrigin(): { x: number; y: number } {
    return {
      x: this.container.x,
      y: this.container.y,
    };
  }

  setSizeOrigin(x: number, y: number, width: number, height: number) {
    this.container.x = x;
    this.container.y = y;
    this.graphics
      .clear()
      .beginFill(this.fill, this.fillAlpha)
      .drawEllipse(0, 0, width, height)
      .endFill();
    if (this.id) this.options?.onUpdate?.(this.serialize());
  }

  getSize(): { width: number; height: number; radius: number } {
    return {
      width: this.graphics.width,
      height: this.graphics.height,
      radius: this.graphics.width / 2,
    };
  }

  setFill(fills: FillPropertyData[], emit: boolean = false) {
    const { width, height } = this.graphics;
    this.graphics.clear();
    fills.forEach((fillProperty) => {
      this.graphics
        .beginFill(fillProperty.color, fillProperty.alpha)
        .drawRect(0, 0, width, height)
        .endFill();
    });

    if (emit && this.id)
      this.options?.onUpdate?.(this.serialize());
  }

  setStrokes(strokes: StrokePropertyData[], emit: boolean = true) {
    strokes.forEach((stroke) => {
      const startCoordinate = stroke.width / 2;
      const strokes = new Graphics()
        .lineStyle({
          color: stroke.color,
          alpha: stroke.alpha,
          width: stroke.width,
        })
        .drawEllipse(
          startCoordinate,
          startCoordinate,
          this.graphics.width - stroke.width,
          this.graphics.height - stroke.width,
        )
        .endFill();
      this.container.addChild(strokes);
    });

    if (this.id && emit)
      this.options?.onUpdate?.(this.serialize());
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

  public deselect() {
    if (!this.selected) return;
    this.container.removeChild(this.highlight);
    this.selected = false;
  }

  public select() {
    if (this.selected) return;
    this.container.addChild(this.highlight);
    this.options?.onSelect(this);
    this.selected = true;
  }

  public showHighlight() {
    if (this.highlighted || this.selected) return;
    this.container.addChild(this.highlight);
    this.highlighted = true;
  }

  public hideHighlight() {
    if (!this.highlighted) return;
    this.container.removeChild(this.highlight);
    this.highlighted = false;
  }

  serialize(): Shape {
    throw new Error("Method not implemented.");
  }

  init(data: Omit<Shape, "id">) {
    this.fills = data.fills;
    this.graphics.clear();
    this.fills.forEach((fillProperty) => {
      this.graphics
        .beginFill(fillProperty.color, fillProperty.alpha)
        .drawRect(0, 0, data.graphics.width, data.graphics.height)
        .endFill();
    });
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

  clear() {
    this.container.destroy();
  }

  on(
    event: "pointerdown" | "pointerover" | "pointerout",
    handler: (event: FederatedPointerEvent) => void,
  ) {
    this.container.on(event, handler);
  }

  once(
    event: "pointerdown" | "pointerover" | "pointerout",
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

  createStyle(): string {
    throw new Error("Method not implemented.");
  }
}
