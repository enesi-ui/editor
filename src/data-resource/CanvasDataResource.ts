import { CanvasObject } from "~/canvas/CanvasObject.ts";
import {
  Application,
  Container,
  FederatedPointerEvent,
  Graphics,
  SCALE_MODES,
  Sprite,
  Texture,
} from "pixi.js";
import { DataResource } from "~/data-resource/DataResource.ts";
import { roundNumber } from "~/utility/round.ts";
import { MSAA_QUALITY } from "@pixi/constants";
import { CanvasObjectSelectMove } from "~/shape/CanvasObjectSelectMove.ts";

export class CanvasDataResource implements CanvasObject {
  private readonly highlight: Graphics;
  private readonly selectGraphic: Graphics;
  private readonly container: Container;
  private highlightColor = "#0f79fb";
  private highlightWidth = 2;
  public readonly id: string;
  private selected = false;
  private highlighted = false;

  constructor(
    readonly app: Application,
    private onSelect: (id: string) => void,
    data: DataResource,
  ) {
    const origin = data.container;
    this.container = app.stage.addChild(new Container());
    this.container.eventMode = "static";
    this.container.sortableChildren = true;
    this.container.x = origin.x;
    this.container.y = origin.y;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".75" stroke="white"  width="96" height="96">
<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>`;
    const texture = Texture.from("data:image/svg+xml;charset=utf8," + svg, {
      multisample: MSAA_QUALITY.HIGH,
      scaleMode: SCALE_MODES.LINEAR,
      anisotropicLevel: 32,
      resolution: 2,
    });
    const svgSprite = Sprite.from(texture);

    this.container.addChild(svgSprite);

    this.highlight = new Graphics()
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawRect(0, 0, 48, 48)
      .endFill();

    this.selectGraphic = new Graphics()
      .clear()
      .lineStyle(this.highlightWidth, this.highlightColor)
      .drawRect(0, 0, 48, 48)
      .endFill();

    this.id = data.id;
    new CanvasObjectSelectMove(app, this, (x, y) => {
      this.container.x += x;
      this.container.y += y;
    });
  }

  public deselect() {
    if (!this.selected) return;
    this.container.removeChild(this.selectGraphic);
    this.selected = false;
  }

  public select() {
    if (this.selected) return;
    this.container.addChild(this.selectGraphic);
    this.onSelect(this.id);
    this.selected = true;
  }
  getOrigin(): { x: number; y: number } {
    return {
      x: this.container.x,
      y: this.container.y,
    };
  }

  getSize(): { width: number; height: number; radius: number } {
    return { height: 0, width: 0, radius: 0 };
  }

  showHighlight(): void {
    if (this.highlighted) return;
    this.container.addChild(this.highlight);
    this.highlighted = true;
  }
  hideHighlight(): void {
    if (!this.highlighted) return;
    this.container.removeChild(this.highlight);
    this.highlighted = false;
  }

  setOrigin(x: number, y: number, round?: boolean): void {
    this.container.x = round ? roundNumber(x) : x;
    this.container.y = round ? roundNumber(y) : y;
  }

  setSize(): void {
    throw new Error("Size is not supported for this object type.");
  }

  setSizeOrigin(x: number, y: number, _: number, _1: number, round?: boolean) {
    this.container.x = round ? roundNumber(x) : x;
    this.container.y = round ? roundNumber(y) : y;
  }

  clear() {
    this.container.destroy();
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
}
