import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { createServer, setup, WithProviders } from "~/tests/setup.tsx";
import { Layer } from "~/layers/Layer.tsx";
import { act, waitFor, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import WS from "vitest-websocket-mock";

let server: WS;
describe("Layer", () => {
  beforeEach(() => {
    server = createServer();
  });
  afterEach(() => {
    act(() => {
      server.close();
    });
  });

  it("renders without crashing", async () => {
    setup(<Layer canvasId={"canvasId"} objectId="1" />, {
      wrapper: WithProviders,
    });
    await act(async () => await server.connected);

    act(() => {
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: {
            name: "Some Shape",
            id: "1",
            type: "RECTANGLE",
            fills: [],
            strokes: [],
            container: { x: 0, y: 0, width: 0, height: 0 },
            graphics: { x: 0, y: 0, width: 0, height: 0 },
          },
        }),
      );
    });

    await waitFor(() => expect(screen.getByText("Some Shape")).toBeTruthy());
  });

  it("calls onDragStart when the user starts dragging", async () => {
    const handleDragStart = vi.fn();

    setup(
      <Layer
        canvasId={"canvasId"}
        objectId="1"
        onDragStart={handleDragStart}
      />,
      { wrapper: WithProviders },
    );
    await act(async () => await server.connected);

    act(() => {
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: {
            name: "Some Shape",
            id: "1",
            type: "RECTANGLE",
            fills: [],
            strokes: [],
            container: { x: 0, y: 0, width: 0, height: 0 },
            graphics: { x: 0, y: 0, width: 0, height: 0 },
          },
        }),
      );
    });

    await waitFor(() => expect(screen.getByText("Some Shape")).toBeTruthy());

    const layer = screen.getByText("Some Shape");

    fireEvent.dragStart(layer);

    expect(handleDragStart).toHaveBeenCalledTimes(1);
  });
});
