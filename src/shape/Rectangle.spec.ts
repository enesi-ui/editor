import { describe, expect, it } from "vitest";
import { Rectangle } from "~/shape/Rectangle.ts";
import { Application } from "pixi.js";

describe("Rectangle", () => {
  it("constructs", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    expect(rectangle).toBeDefined();
  });

  it("sets origin", () => {
    const app = new Application();
    const rectangle = new Rectangle({ x: 0, y: 0 }, app);
    rectangle.setSizeOrigin(10, 10, 10, 10);
    expect(rectangle.getOrigin()).toEqual({ x: 10, y: 10 });
  });

  it("serializes", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    expect(rectangle.serialize()).toEqual({
      type: "RECTANGLE",
      container: { x: 0, y: 0, width: 0, height: 0 },
      graphics: { x: 0, y: 0, width: 0, height: 0 },
      fills: [
        {
          alpha: 1,
          color: "#ffffff",
        },
      ],
      strokes: [],
      radius: 0,
      name: "New Rectangle",
      zIndex: 0,
      canvasId: "canvasId",
    });
  });

  it("creates style", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    expect(rectangle.createStyle("test")).toMatchSnapshot();
  });

  it.skip("gets image data", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    expect(rectangle.getImageData()).toBeDefined();
  });

  it("sets fill", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    rectangle.setFill([{ color: "#000000", alpha: 1 }]);
    expect(rectangle.getFill()).toEqual([{ color: "#000000", alpha: 1 }]);
  });

  it("sets stroke", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    rectangle.setStrokes([{ color: "#000000", alpha: 1, width: 1 }]);
    expect(rectangle.getStroke()).toEqual([
      { color: "#000000", alpha: 1, width: 1 },
    ]);
  });

  it("updates graphics", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    rectangle.update({
      type: "RECTANGLE",
      container: { x: 0, y: 0, width: 0, height: 0 },
      graphics: { x: 0, y: 0, width: 0, height: 0 },
      fills: [
        {
          alpha: 1,
          color: "#ffffff",
        },
      ],
      strokes: [],
      radius: 0,
      name: "Some Shape",
      zIndex: 0,
      canvasId: "123",
    });
    expect(rectangle.serialize()).toEqual({
      type: "RECTANGLE",
      container: { x: 0, y: 0, width: 0, height: 0 },
      graphics: { x: 0, y: 0, width: 0, height: 0 },
      fills: [
        {
          alpha: 1,
          color: "#ffffff",
        },
      ],
      strokes: [],
      radius: 0,
      name: "Some Shape",
      zIndex: 0,
      canvasId: "canvasId",
    });
  });
});
