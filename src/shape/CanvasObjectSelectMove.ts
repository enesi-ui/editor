import { Application, FederatedPointerEvent, Point } from "pixi.js";
import { CanvasObject } from "~/canvas/CanvasObject.ts";

export class CanvasObjectSelectMove {
  constructor(
    readonly app: Application,
    private readonly canvasObject: CanvasObject,
  ) {
    let dragPoint: Point;
    const handleDragMove = (event: FederatedPointerEvent) => {
      event.stopPropagation();

      const local = event.getLocalPosition(this.app.stage);
      this.canvasObject.setOrigin(local.x - dragPoint.x, local.y - dragPoint.y, true, true);
    };
    const handleDragStart = (event: FederatedPointerEvent) => {
      event.stopPropagation();

      dragPoint = event.getLocalPosition(this.app.stage);
      const { x, y } = this.canvasObject.getOrigin();
      dragPoint.x -= x;
      dragPoint.y -= y;

      app.stage.on("pointermove", handleDragMove);
      app.stage.once("pointerup", handleDragEnd);

      this.canvasObject.select();
    };
    const handleDragEnd = (event: FederatedPointerEvent) => {
      event.stopPropagation();

      app.stage.off("pointermove", handleDragMove);
    };
    this.canvasObject.on("pointerdown", handleDragStart);

    const handleHighlight = () => {
      this.canvasObject.showHighlight();
      this.canvasObject.once("pointerout", () => this.canvasObject.hideHighlight());
    };

    this.canvasObject.on("pointerover", handleHighlight);
  }
}
