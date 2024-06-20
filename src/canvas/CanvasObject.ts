import { FederatedPointerEvent } from "pixi.js";

export interface CanvasObject {
  select(): void;
  deselect(): void;
  showHighlight(): void;
  hideHighlight(): void;
  getOrigin(): { x: number; y: number };
  setOrigin(x: number, y: number, round?: boolean, emit?: boolean): void;
  getSize(): { width: number; height: number, radius: number };
  setSize(width: number, height: number, round?: boolean, emit?: boolean): void;
  setSizeOrigin(x: number, y: number, width: number, height: number, round?: boolean, emit?: boolean): void;
  get id(): string | undefined;

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

