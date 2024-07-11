import { setupHook } from "~/tests/setup";
import { describe, it, expect, beforeEach } from "vitest";
import { useCanvasShapes } from "~/canvas/useCanvasShapes.ts";
import { act, waitFor } from "@testing-library/react";
import { canvasShapeStore } from "~/canvas/CanvasShapeStore.ts";
const store = canvasShapeStore();

describe("useCanvasShapes", () => {
  beforeEach(() => {
    store.current.clear();
  });
  it("constructs without crashing", async () => {
    const { result, server } = setupHook(() => useCanvasShapes("canvasId"));

    expect(result).not.toBe(null);

    act(() => server.close());
  });

  it("initially returns no canvas shapes if no shapes are returned from endpoint", async () => {
    const { server } = setupHook(() => useCanvasShapes("canvasId"));
    await act(async () => await server.connected);

    await waitFor(() => expect(store.current.data).toEqual([]));

    act(() => server.close());
  });

  it("initially creates canvas shapes from the shapes returned from endpoint", async () => {
    expect.hasAssertions();
    const { server } = setupHook(() => useCanvasShapes("canvasId"));

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

    await waitFor(() => expect(store.current.data.length).toEqual(1));
    await waitFor(() => expect(store.current.data[0].id).toEqual("1"));

    act(() => {
      server.close();
    });
  });

  it("sends initial shapes/get event to websocket", async () => {
    expect.assertions(1);

    const { server } = setupHook(() => useCanvasShapes("canvasId"));
    await act(async () => await server.connected);

    const getAllMessage = JSON.stringify({
      event: "shapes/get",
      data: "canvasId",
    });

    await act(async () => {
      await expect(server).toReceiveMessage(getAllMessage);
    });

    act(() => {
      server.close();
    });
  });
});
