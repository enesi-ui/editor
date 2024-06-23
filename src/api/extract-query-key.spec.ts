import { describe, test, expect } from "vitest";
import { extractQueryKeys } from "~/api/extract-query-key.ts";

describe("extract-query-key", () => {
  test("should extract query key from a websocket event with id", () => {
    const event = "shapes/:id/get";
    const result = extractQueryKeys({ event, data: { id: "123" } });
    expect(result).toEqual({ method: "get", keys: ["shapes", "123"] });
  });

  test("should extract query key from a websocket event", () => {
    const event = "shapes/get";
    const result = extractQueryKeys({ event, data: {} });
    expect(result).toEqual({ method: "get", keys: ["shapes"] });
  });

  test("should extract query key from a websocket event with subpath", () => {
    const event = "shapes/:id/main-component/get";
    const result = extractQueryKeys({ event, data: { id: "123" } });
    expect(result).toEqual({
      method: "get",
      keys: ["shapes", "123", "main-component"],
    });
  });

  test("post method has id in keys", () => {
    const event = "shapes/post";
    const result = extractQueryKeys({ event, data: { id: "123" } });
    expect(result).toEqual({
      method: "post",
      keys: ["shapes"],
    });
  });

  test("post method has id in keys and :id", () => {
    const event = "shapes/:id/post";
    const result = extractQueryKeys({ event, data: { id: "123" } });
    expect(result).toEqual({
      method: "post",
      keys: ["shapes", "123"],
    });
  });

  test("selection event", () => {
    const event = "selection/:canvasId/get";
    const result = extractQueryKeys({
      event,
      data: { canvasId: "123", shapeIds: ["312"] },
    });
    expect(result).toEqual({
      method: "get",
      keys: ["selection", "123"],
    });
  });

  test("patch method", () => {
    const event = "shapes/:id/patch";
    const result = extractQueryKeys({ event, data: { id: "123" } });
    expect(result).toEqual({
      method: "patch",
      keys: ["shapes", "123"],
    });
  });
});
