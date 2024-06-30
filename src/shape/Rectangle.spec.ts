import { describe, expect, it } from "vitest";
import { Rectangle } from "~/shape/Rectangle.ts";
import { Application } from "pixi.js";
import { Shape } from "~/shape/CanvasShape.ts";

const data: Shape = {
  id: "12",
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
};

describe("Rectangle", () => {
  it("constructs", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
    expect(rectangle).toBeDefined();
  });

  it("sets origin", () => {
    const app = new Application();
    const rectangle = new Rectangle({ x: 0, y: 0 }, app, data);
    rectangle.setSizeOrigin(10, 10, 10, 10);
    expect(rectangle.getOrigin()).toEqual({ x: 10, y: 10 });
  });

  it("serializes", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
    expect(rectangle.serialize()).toEqual({
      id: "12",
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
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
    expect(rectangle.createStyle("test")).toMatchSnapshot();
  });

  it.skip("gets image data", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
    expect(rectangle.getImageData()).toBeDefined();
  });

  it("sets fill", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
    rectangle.update({ ...data, fills: [{ color: "#000000", alpha: 1 }] });
    expect(rectangle.serialize()).toEqual({
      id: "12",
      type: "RECTANGLE",
      container: { x: 0, y: 0, width: 0, height: 0 },
      graphics: { x: 0, y: 0, width: 0, height: 0 },
      fills: [{ color: "#000000", alpha: 1 }],
      strokes: [],
      radius: 0,
      name: "New Rectangle",
      zIndex: 0,
      canvasId: "canvasId",
    });
  });

  it("sets stroke", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
    rectangle.update({...data, strokes: [{ color: "#d12020", alpha: 1, width: 1 }]});
    expect(rectangle.serialize()).toEqual({
      id: "12",
      type: "RECTANGLE",
      container: { x: 0, y: 0, width: 0, height: 0 },
      graphics: { x: 0, y: 0, width: 0, height: 0 },
      fills: [
        {
          alpha: 1,
          color: "#000000",
        },
      ],
      strokes: [{ color: "#d12020", alpha: 1, width: 1 }],
      radius: 0,
      name: "New Rectangle",
      zIndex: 0,
      canvasId: "canvasId",
    });
  });

  it("updates graphics", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application(), data);
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
      id: "12",
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
