import { beforeEach, describe, expect, test, vi } from "vitest";
import { setup } from "~/tests/setup";
import { ShapeKeyboardControl } from "~/shape/ShapeKeyboardControl.tsx";
import { canvasShapeMock } from "~/shape/CanvasShapeMock.ts";
import { QueryWrapper } from "~/tests/QueryWrapper.tsx";
import { CanvasObjectContext } from "~/canvas/CanvasObjectContext.ts";
import { ToolContext } from "~/tool/ToolContext.ts";
import { MousePosition, Tools } from "~/tool/Tools.ts";

const mockDelete = vi.fn();
vi.mock("../api/useShapesWebSocket", () => ({
  useShapesWebSocket: () => ({
    delete: mockDelete,
  }),
}));
describe("ShapeKeyboardControl", () => {
  beforeEach(() => {
    mockDelete.mockClear();
    vi.mocked(canvasShapeMock).clear();
  });
  test("removes shape when delete key is pressed", async () => {
    const mockCurrentObject = vi.fn();
    const position = { current: MousePosition.CANVAS };

    const { user } = setup(
      <QueryWrapper>
        <CanvasObjectContext.Provider
          value={{
            currentObject: canvasShapeMock,
            setCurrentObject: mockCurrentObject,
          }}
        >
          <ToolContext.Provider
            value={{
              tool: Tools.SELECT,
              setTool: vi.fn(),
              position,
            }}
          >
            <ShapeKeyboardControl canvasShapeId={"shapeId"} />
          </ToolContext.Provider>
        </CanvasObjectContext.Provider>
        ,
      </QueryWrapper>,
    );

    await user.keyboard("[Backspace]");

    expect(mockDelete).toHaveBeenCalled();
  });

  test("does not remove shape when delete key is pressed and mouse position is in left panel", async () => {
    const mockCurrentObject = vi.fn();
    const position = { current: MousePosition.LEFT_PANEL };

    const { user } = setup(
      <QueryWrapper>
        <CanvasObjectContext.Provider
          value={{
            currentObject: canvasShapeMock,
            setCurrentObject: mockCurrentObject,
          }}
        >
          <ToolContext.Provider
            value={{
              tool: Tools.SELECT,
              setTool: vi.fn(),
              position,
            }}
          >
            <ShapeKeyboardControl canvasShapeId={"shapeId"} />
          </ToolContext.Provider>
        </CanvasObjectContext.Provider>
        ,
      </QueryWrapper>,
    );

    await user.keyboard("[Backspace]");

    expect(mockDelete).not.toHaveBeenCalled();
  });

  test("deselects current object when delete key is pressed", async () => {
    const mockCurrentObject = vi.fn();
    const position = { current: MousePosition.CANVAS };

    const { user } = setup(
      <QueryWrapper>
        <CanvasObjectContext.Provider
          value={{
            currentObject: canvasShapeMock,
            setCurrentObject: mockCurrentObject,
          }}
        >
          <ToolContext.Provider
            value={{
              tool: Tools.SELECT,
              setTool: vi.fn(),
              position,
            }}
          >
            <ShapeKeyboardControl canvasShapeId={"shapeId"} />
          </ToolContext.Provider>
        </CanvasObjectContext.Provider>
        ,
      </QueryWrapper>,
    );

    await user.keyboard("[Backspace]");

    expect(mockCurrentObject).toHaveBeenCalledWith(null);
  });
});
