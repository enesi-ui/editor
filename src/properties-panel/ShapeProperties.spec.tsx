import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createServer, setup, WithProviders } from "~/tests/setup.tsx";
import { ShapeProperties } from "~/properties-panel/ShapeProperties.tsx";
import { act, screen, waitFor } from "@testing-library/react";
import WS from "vitest-websocket-mock";

let server: WS;
describe("ShapeProperties", () => {
  beforeEach(() => {
    server = createServer();
  });
  afterEach(() => {
    act(() => {
      server.close();
    });
  });

  it("renders", async () => {
    setup(<ShapeProperties shapeId="1" />, { wrapper: WithProviders });

    await act(async () => await server.connected);

    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("changes value", async () => {
    const { user } = setup(<ShapeProperties shapeId="1" />, {
      wrapper: WithProviders,
    });

    await act(async () => await server.connected);

    await act(async () => {
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: {
            id: "1",
            container: { x: 0, y: 0, height: 0, width: 0 },
            graphics: { x: 0, y: 0, height: 0, width: 0 },
            radius: 0,
            fills: [],
            strokes: [],
          },
        }),
      );
    });


    await user.clear(screen.getByLabelText("X"));
    await user.type(screen.getByLabelText("X"), "100[enter]");

    await waitFor(async () => {
      await expect(server).toReceiveMessage(
        JSON.stringify({
          event: "shapes/:id/patch",
          data: { id: "1", container: { x: 100, y: 0, height: 0, width: 0 } },
        }),
      );
    });
  });

  it.each([
    { id: "X", data: { container: { x: 100, y: 0, height: 0, width: 0 } } },
    { id: "Y", data: { container: { x: 0, y: 100, height: 0, width: 0 } } },
    { id: "W", data: { graphics: { x: 0, y: 0, height: 0, width: 100 } } },
    { id: "H", data: { graphics: { x: 0, y: 0, height: 100, width: 0 } } },
    { id: "R", data: { radius: 100 } },
  ])("shows value changes from server", async ({id, data}) => {
    setup(<ShapeProperties shapeId="1" />, { wrapper: WithProviders });

    await act(async () => await server.connected);
    await act(async () => {
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: {
            id: "1",
            fills: [],
            strokes: [],
            container: { x: 0, y: 0, height: 0, width: 0 },
            graphics: { x: 0, y: 0, height: 0, width: 0 },
            ...data,
          },
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByLabelText(id)).toHaveValue("100");
    });
  });
});
