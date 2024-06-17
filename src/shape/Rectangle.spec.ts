import { describe, expect, it } from "vitest";
import { Rectangle } from "~/shape/Rectangle.ts";
import { Application } from "pixi.js";

describe("Rectangle", () => {
  it("constructs", () => {
    const rectangle = new Rectangle({ x: 0, y: 0 }, new Application());
    expect(rectangle).toBeDefined();
  });
});
