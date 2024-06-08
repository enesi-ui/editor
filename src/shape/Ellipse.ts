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
      this.setData(options?.data);
      this.id = options?.data.id;
    }
    new CanvasObjectSelectMove(app, this);
  }

  getOrigin(): { x: number; y: number } {
    return {
      x: this.container.x,
      y: this.container.y,
    };
  }

  async setOrigin(x: number, y: number): Promise<void> {
    this.container.x = x;
    this.container.y = y;
    if (this.id)
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  async setSize(width: number, height: number): Promise<void> {
    this.graphics
      .clear()
      .beginFill(this.fill, this.fillAlpha)
      .drawEllipse(0, 0, width, height)
      .endFill();
    this.highlight
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawEllipse(0, 0, this.graphics.width / 2, this.graphics.height / 2)
      .endFill();
    if (this.id)
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  async setSizeOrigin(x: number, y: number, width: number, height: number) {
    this.container.x = x;
    this.container.y = y;
    this.graphics
      .clear()
      .beginFill(this.fill, this.fillAlpha)
      .drawEllipse(0, 0, width, height)
      .endFill();
    if (this.id)
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  getSize(): { width: number; height: number } {
    return {
      width: this.graphics.width,
      height: this.graphics.height,
    };
  }

  setFill(color: string, alpha: number) {
    const { width, height } = this.graphics;
    this.graphics
      .clear()
      .beginFill(color, alpha)
      .drawEllipse(0, 0, width, height)
      .endFill();
    this.fill = color;
    this.fillAlpha = alpha;
  }

  setStrokes(strokes: StrokePropertyData[]) {
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

  createStyle(className: string): string {
    return `<style> .${className} { width: ${this.width}px; height: ${this.height}px; background-color: ${this.fill}; color: white; border: none;}</style>`;
  }

  serialize(): Omit<Shape, "id"> {
    throw new Error("Method not implemented.");
  }

  setData(data: Omit<Shape, "id">) {
    this.graphics
      .clear()
      .beginFill(data.fill, data.fillAlpha)
      .drawRect(0, 0, data.graphics.width, data.graphics.height)
      .endFill();
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
}
