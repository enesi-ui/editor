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

export class Rectangle implements CanvasShape {
  private readonly graphics: Graphics;
  private readonly selectGraphics: Graphics;
  private readonly highlight: Graphics;
  private readonly container: Container;
  private strokes: StrokePropertyData[] = [];
  private currentStrokes: Graphics[] = [];
  private readonly handles: Graphics[] = [];
  private selected = false;
  private fill = "#ffffff";
  private fillAlpha = 1;
  private highlightColor = "#0f79fb";
  private highlightWidth = 2;
  private handlesColor = "#0f79fb";
  private handleFill = "#ffffff";
  private handlesWidth = 1;
  private handleSize = 8;
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
      app.stage.on("pointermove", this.resizeHandle0);
      this.handles[0].once("pointerup", () => {
        app.stage.off("pointermove", this.resizeHandle0);
      });
    });

    this.handles[1].cursor = "nesw-resize";
    this.handles[1].eventMode = "static";
    this.handles[1].on("pointerdown", (event) => {
      event.stopPropagation();
      app.stage.on("pointermove", this.resizeHandle1);
      this.handles[1].once("pointerup", () => {
        app.stage.off("pointermove", this.resizeHandle1);
      });
    });

    this.handles[2].cursor = "nesw-resize";
    this.handles[2].eventMode = "static";
    this.handles[2].on("pointerdown", (event) => {
      event.stopPropagation();
      app.stage.on("pointermove", this.resizeHandle2);
      this.handles[2].once("pointerup", () => {
        app.stage.off("pointermove", this.resizeHandle2);
      });
    });

    this.handles[3].cursor = "nwse-resize";
    this.handles[3].eventMode = "static";
    this.handles[3].on("pointerdown", (event) => {
      event.stopPropagation();
      app.stage.on("pointermove", this.resizeHandle3);
      this.handles[3].once("pointerup", () => {
        app.stage.off("pointermove", this.resizeHandle3);
      });
    });

    if (options?.data) {
      this.setData(options.data);
      this.id = options.data.id;
    }

    new CanvasObjectSelectMove(app, this);
  }

  getFill(): string {
    return this.fill;
  }
  getStroke(): StrokePropertyData[] {
    return this.strokes;
  }

  resizeHandle1 = (event: FederatedPointerEvent) => {
    const { x: localX } = this.container.toLocal(event.global);
    const { height } = this.getSize();

    const pointerY = event.global.y;

    const { x, y } = this.getOrigin();
    this.setOrigin(x, pointerY);

    this.setSize(localX, height - pointerY + y);
    this.update();
    this.setStrokes(this.strokes);
  };

  resizeHandle2 = (event: FederatedPointerEvent) => {
    const { y: localY } = this.container.toLocal(event.global);
    const { width } = this.getSize();

    const pointerX = event.global.x;
    const { x, y } = this.getOrigin();
    this.setOrigin(pointerX, y);

    this.setSize(width - pointerX + x, localY);
    this.update();
    this.setStrokes(this.strokes);
  };

  resizeHandle3 = (event: FederatedPointerEvent) => {
    const { x, y } = this.container.toLocal(event.global);

    this.setSize(x, y);
    this.update();
    this.setStrokes(this.strokes);
  };

  resizeHandle0 = (event: FederatedPointerEvent) => {
    const { width, height } = this.graphics;

    const pointerX = event.global.x;
    const pointerY = event.global.y;

    const { x, y } = this.getOrigin();
    this.setOrigin(pointerX, pointerY);
    this.setSize(width - pointerX + x, height - pointerY + y);
    this.update();
    this.setStrokes(this.strokes);
  };

  private update() {
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
  }

  getOrigin(): { x: number; y: number } {
    return {
      x: this.container.x,
      y: this.container.y,
    };
  }

  async setOrigin(x: number, y: number, round: boolean = true): Promise<void> {
    this.container.x = round ? roundNumber(x) : x;
    this.container.y = round ? roundNumber(y) : y;
    if (this.id) {
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
    }
  }

  async setSize(
    width: number,
    height: number,
    round: boolean = true,
  ): Promise<void> {
    const roundedWidth = round ? roundNumber(width) : width;
    const roundedHeight = round ? roundNumber(height) : height;
    this.graphics
      .clear()
      .beginFill(this.fill, this.fillAlpha)
      .drawRect(0, 0, roundedWidth, roundedHeight)
      .endFill();
    this.update();
    if (this.id)
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
  }

  async setSizeOrigin(
    x: number,
    y: number,
    width: number,
    height: number,
    round?: boolean,
  ) {
    this.container.x = round ? roundNumber(x) : x;
    this.container.y = round ? roundNumber(y) : y;
    const roundedWidth = round ? roundNumber(width) : width;
    const roundedHeight = round ? roundNumber(height) : height;
    this.graphics
      .clear()
      .beginFill(this.fill, this.fillAlpha)
      .drawRect(0, 0, roundedWidth, roundedHeight)
      .endFill();
    this.update();

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

  async setFill(color: string, alpha: number) {
    const { width, height } = this.graphics;
    this.graphics
      .clear()
      .beginFill(color, alpha)
      .drawRect(0, 0, width, height)
      .endFill();
    this.fill = color;
    this.fillAlpha = alpha;
    if (this.id) {
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
    }
  }

  async setStrokes(strokes: StrokePropertyData[]) {
    this.currentStrokes.map((currentStroke) =>
      this.container.removeChild(currentStroke),
    );
    strokes.forEach((strokeProperty) => {
      const startCoordinate = strokeProperty.width / 2;
      const stroke = new Graphics()
        .lineStyle({
          color: strokeProperty.color,
          alpha: strokeProperty.alpha,
          width: strokeProperty.width,
        })
        .drawRect(
          startCoordinate,
          startCoordinate,
          this.graphics.width - strokeProperty.width,
          this.graphics.height - strokeProperty.width,
        )
        .endFill();
      stroke.zIndex = 2;
      this.currentStrokes.push(this.container.addChild(stroke));
    });
    this.strokes = strokes;

    if (this.id) {
      await this.options?.onUpdate?.({
        ...this.serialize(),
        id: this.id,
      });
    }
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
    this.container.removeChild(this.selectGraphics);
    this.container.removeChild(...this.handles);
    this.selected = false;
  }

  public select() {
    if (this.selected) return;
    this.container.addChild(this.selectGraphics);
    this.container.addChild(...this.handles);
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

  createStyle(className: string): string {
    return `<style> .${className} { width: ${this.width}px; height: ${this.height}px; background-color: ${this.fill}; color: white; border: none;}</style>`;
  }

  serialize(): Omit<Shape, "id"> {
    return {
      type: "RECTANGLE",
      fill: this.fill,
      fillAlpha: this.fillAlpha,
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
    };
  }

  setData(data: Omit<Shape, "id">) {
    this.graphics
      .clear()
      .beginFill(data.fill, data.fillAlpha)
      .drawRect(0, 0, data.graphics.width, data.graphics.height)
      .endFill();
    this.setStrokes(data.strokes);
    this.update();
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
}
