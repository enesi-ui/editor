import { FederatedPointerEvent } from "pixi.js";
export interface CanvasObject {
  select(): void;
  deselect(): void;
  showHighlight(): void;
  hideHighlight(): void;
  getOrigin(): { x: number; y: number };

  get id(): string;
  get canvasId(): string;

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

