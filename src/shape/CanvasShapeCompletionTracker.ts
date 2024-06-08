import { Application, FederatedPointerEvent } from "pixi.js";
import { CanvasShape } from "~/shape/CanvasShape.ts";

export class CanvasShapeCompletionTracker {
  constructor(
    app: Application,
    private readonly shape: CanvasShape,
    private readonly onDone?: (shape: CanvasShape) => Promise<void>,
  ) {
    app.stage.on("pointermove", this.init);

    const up = async () => {
      await this.onDone?.(shape);
      app.stage.off("pointermove", this.init);
      app.stage.off("pointerup", up);
    };

    app.stage.on("pointerup", up);
  }

  private init = (event: FederatedPointerEvent) => {
    const pointer = event.global;
    const { x, y } = this.shape.getOrigin();
    const isInvertedX = pointer.x < x;
    const isInvertedY = pointer.y < y;
    this.shape.setOrigin(isInvertedX ? pointer.x : x, isInvertedY ? pointer.y : y);
    this.shape.setSize(Math.abs(pointer.x - x), Math.abs(pointer.y - y));
  }
}
