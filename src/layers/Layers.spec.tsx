import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createServer, setup, WithProviders } from "~/tests/setup.tsx";
import { Layers } from "~/layers/Layers.tsx";
import { act, screen, waitFor } from "@testing-library/react";
import WS from "vitest-websocket-mock";

let server: WS;
describe("Layers", () => {
  beforeEach(() => {
    server = createServer();
  });
  afterEach(() => {
    act(() => {
      server.close();
    });
  });
  it("renders with out crashing", () => {
    setup(<Layers canvasId={"canvasId"} />, { wrapper: WithProviders });
  });

  it("renders a list of shapes", async () => {
    expect.hasAssertions();
    setup(<Layers canvasId={"canvasId"} />, { wrapper: WithProviders });
    await act(async () => await server.connected);

    const data = [
      {
        name: "Some Shape",
        id: "1",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
      {
        name: "Some Other Shape",
        id: "2",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
    ];

    server.send(
      JSON.stringify({
        event: "shapes/get",
        data: data,
      }),
    );
    server.send(
      JSON.stringify({
        event: "shapes/:id/get",
        data: data[0],
      }),
    );
    server.send(
      JSON.stringify({
        event: "shapes/:id/get",
        data: data[1],
      }),
    );

    await waitFor(() =>
      expect(screen.getByText("Some Shape")).toBeInTheDocument(),
    );
    expect(screen.getByText("Some Other Shape")).toBeInTheDocument();
  });

  it("renders a list of layer with a selected shape", async () => {
    expect.hasAssertions();
    setup(<Layers canvasId={"canvasId"} />, { wrapper: WithProviders });
    await act(async () => await server.connected);

    const data = [
      {
        name: "Some Shape",
        id: "1",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
      {
        name: "Some Other Shape",
        id: "2",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
    ];

    act(() => {
      server.send(
        JSON.stringify({
          event: "shapes/get",
          data: data,
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[0],
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[1],
        }),
      );
    });

    act(() =>
      server.send(
        JSON.stringify({
          event: "selection/:canvasId/get",
          data: {
            canvasId: "canvasId",
            shapeIds: ["1"],
          },
        }),
      ),
    );

    await waitFor(() =>
      expect(screen.getByText("Some Shape")).toBeInTheDocument(),
    );
    expect(screen.getByText("Some Other Shape")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("Some Shape").closest("li")?.childNodes[0],
      ).toHaveClass("active"),
    );
    await waitFor(() =>
      expect(
        screen.getByText("Some Other Shape").closest("li")?.childNodes[0],
      ).not.toHaveClass("active"),
    );
  });

  it("renders the selected layer after clicking on it", async () => {
    expect.hasAssertions();

    setup(<Layers canvasId={"canvasId"} />, { wrapper: WithProviders });
    await act(async () => await server.connected);

    const data = [
      {
        name: "Some Shape",
        id: "1",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
      {
        name: "Some Other Shape",
        id: "2",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
    ];

    act(() => {
      server.send(
        JSON.stringify({
          event: "shapes/get",
          data: data,
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[0],
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[1],
        }),
      );
    });

    act(() =>
      server.send(
        JSON.stringify({
          event: "selection/:canvasId/get",
          data: {
            canvasId: "canvasId",
            shapeIds: ["1"],
          },
        }),
      ),
    );

    await waitFor(() =>
      expect(screen.getByText("Some Shape")).toBeInTheDocument(),
    );
    expect(screen.getByText("Some Other Shape")).toBeInTheDocument();

    act(() => {
      screen.getByText("Some Other Shape").click();
    });

    const selectMessage = JSON.stringify({
      event: "selection/:canvasId/put",
      data: {
        canvasId: "canvasId",
        selectShapes: ["2"],
        deselectShapes: [],
        deselectAll: true,
      },
    });

    await waitFor(() => expect(server).toReceiveMessage(selectMessage));
  });

  it("double clicking on the layer name changes the name to an input", async () => {
    expect.hasAssertions();

    const { user } = setup(<Layers canvasId={"canvasId"} />, {
      wrapper: WithProviders,
    });
    await act(async () => await server.connected);

    const data = [
      {
        name: "Some Shape",
        id: "1",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
      {
        name: "Some Other Shape",
        id: "2",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
    ];

    act(() => {
      server.send(
        JSON.stringify({
          event: "shapes/get",
          data: data,
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[0],
        }),
      );
    });

    await waitFor(() =>
      expect(screen.getByText("Some Shape")).toBeInTheDocument(),
    );

    await act(async () => {
      await user.dblClick(screen.getByText("Some Shape"));
    });

    expect(screen.getByDisplayValue("Some Shape")).toBeInTheDocument();
  });

  it("double clicking on the layer name focuses the input", async () => {
    expect.hasAssertions();

    const { user } = setup(<Layers canvasId={"canvasId"} />, {
      wrapper: WithProviders,
    });
    await act(async () => await server.connected);

    const data = [
      {
        name: "Some Shape",
        id: "1",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
      {
        name: "Some Other Shape",
        id: "2",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
      },
    ];

    act(() => {
      server.send(
        JSON.stringify({
          event: "shapes/get",
          data: data,
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[0],
        }),
      );
    });

    await waitFor(() =>
      expect(screen.getByText("Some Shape")).toBeInTheDocument(),
    );

    await act(async () => {
      await user.dblClick(screen.getByText("Some Shape"));
    });

    expect(screen.getByDisplayValue("Some Shape")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Some Shape")).toHaveFocus();
  });

  it("renders layer in order of z-index", async () => {
    expect.hasAssertions();

    setup(<Layers canvasId={"canvasId"} />, { wrapper: WithProviders });
    await act(async () => await server.connected);

    const data = [
      {
        name: "Some Shape",
        id: "1",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
        zIndex: 1,
      },
      {
        name: "Some Other Shape",
        id: "2",
        type: "RECTANGLE",
        fills: [],
        strokes: [],
        container: { x: 0, y: 0, width: 0, height: 0 },
        graphics: { x: 0, y: 0, width: 0, height: 0 },
        zIndex: 0,
      },
    ];

    act(() => {
      server.send(
        JSON.stringify({
          event: "shapes/get",
          data: data,
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[0],
        }),
      );
      server.send(
        JSON.stringify({
          event: "shapes/:id/get",
          data: data[1],
        }),
      );
    });

    await waitFor(() =>
      expect(screen.getByText("Some Shape")).toBeInTheDocument(),
    );
    expect(screen.getByText("Some Other Shape")).toBeInTheDocument();

    const list = screen.getByRole("list");
    const items = list.querySelectorAll("li");

    expect(items[0]).toHaveTextContent("Some Other Shape");
    expect(items[1]).toHaveTextContent("Some Shape");
  });
});
