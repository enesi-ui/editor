import { setupHook } from "~/tests/setup";
import { describe, it, expect, vi } from "vitest";
import { useCanvasShapes } from "~/canvas/useCanvasShapes.ts";
import { act, waitFor } from "@testing-library/react";

vi.mock("~/shape/Rectangle", () => {
  class RectangleMock {
    constructor(
      public container: Record<string, number>,
      public app: Record<string, unknown>,
      public options: Record<string, unknown>,
    ) {}
    get id() {
      return "1";
    }
  }
  return { Rectangle: RectangleMock };
});

describe.only("useCanvasShapes", () => {
  it("constructs without crashing", async () => {
    const { result, server } = setupHook(() => useCanvasShapes());
    expect(result).not.toBe(null);
    server.close();
  });

  it("initially returns no canvas shapes if no shapes are returned from endpoint", async () => {
    const { result, server } = setupHook(() => useCanvasShapes());
    await act(async () => await server.connected);
    expect(result.current.canvasShapes.current).toEqual([]);
    server.close();
  });

  it("initially creates canvas shapes from the shapes returned from endpoint", async () => {
    expect.hasAssertions();
    const { result, server } = setupHook(() => useCanvasShapes());

    await act(async () => await server.connected);

    server.send(
      JSON.stringify({
        event: "shapes/get",
        data: [
          {
            id: "1",
            type: "RECTANGLE",
            fills: [],
            strokes: [],
            container: { x: 0, y: 0, width: 0, height: 0 },
            graphics: { x: 0, y: 0, width: 0, height: 0 },
          },
        ],
      }),
    );
    server.send(
      JSON.stringify({
        event: "shapes/:id/get",
        data: {
          id: "1",
          type: "RECTANGLE",
          fills: [],
          strokes: [],
          container: { x: 0, y: 0, width: 0, height: 0 },
          graphics: { x: 0, y: 0, width: 0, height: 0 },
        },
      }),
    );

    await waitFor(() =>
      expect(result.current.canvasShapes.current.length).toEqual(1),
    );
    await waitFor(() =>
      expect(result.current.canvasShapes.current[0].id).toEqual("1"),
    );

    act(() => {
      server.close();
    });
  });

  it("sends initial shapes/get event to websocket", async () => {
    expect.assertions(2);

    const { server } = setupHook(() => useCanvasShapes());
    await act(async () => await server.connected);

    const getAllMessage = JSON.stringify({ event: "shapes/get" });

    await act(async () => {
      await expect(server).toReceiveMessage(getAllMessage);
    });

    act(() =>
      server.send(
        JSON.stringify({
          event: "shapes/get",
          data: [
            {
              id: "1",
              type: "RECTANGLE",
              fills: [],
              strokes: [],
              container: { x: 0, y: 0, width: 0, height: 0 },
              graphics: { x: 0, y: 0, width: 0, height: 0 },
            },
          ],
        }),
      ),
    );

    const getIdMessage = JSON.stringify({ event: "shapes/:id/get", data: "1" });

    await waitFor(() => expect(server).toReceiveMessage(getIdMessage));

    act(() => {
      server.close();
    });
  });
});
