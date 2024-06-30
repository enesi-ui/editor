import { FederatedPointerEvent } from "pixi.js";
import { Layer } from "~/layers/Layer.ts";

export interface CanvasObject extends Layer {
  select(): void;
  deselect(): void;
  showHighlight(): void;
  hideHighlight(): void;
  getOrigin(): { x: number; y: number };
  getSize(): { width: number; height: number };

  get id(): string;

  clear(): void;

  on(
    event: "pointerdown" | "pointerover" | "pointerout" | "pointerup",
    handler: (event: FederatedPointerEvent) => void,
  ): void;
  once(
    event: "pointerdown" | "pointerover" | "pointerout" | "pointerup",
    handler: (event: FederatedPointerEvent) => void,
  ): void;
  off(
    event: "pointerdown" | "pointerover" | "pointerout" | "pointerup",
    handler: (event: FederatedPointerEvent) => void,
  ): void;
}

