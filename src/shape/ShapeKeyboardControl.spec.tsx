import { describe, test, vi, expect, beforeEach } from "vitest";
import { setup } from "~/tests/setup.ts";
import { ShapeKeyboardControl } from "~/shape/ShapeKeyboardControl.tsx";
import { canvasShapeMock } from "~/shape/CanvasShapeMock.ts";
import { QueryWrapper } from "~/tests/QueryWrapper.tsx";
import { CanvasObjectContext } from "~/canvas/CanvasObjectContext.ts";

const mockDelete = vi.fn();
vi.mock('../api/useShapesWebSocket', () => ({
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

    const { user } = setup(
      <QueryWrapper>
        <CanvasObjectContext.Provider
          value={{
            currentObject: canvasShapeMock,
            setCurrentObject: mockCurrentObject,
          }}
        >
          <ShapeKeyboardControl canvasShapeId={'shapeId'} />
        </CanvasObjectContext.Provider>
        ,
      </QueryWrapper>,
    );

    await user.keyboard("[Backspace]");

    expect(mockDelete).toHaveBeenCalled();
  });

  test("deselects current object when delete key is pressed", async () => {
    const mockCurrentObject = vi.fn();

    const { user } = setup(
      <QueryWrapper>
        <CanvasObjectContext.Provider
          value={{
            currentObject: canvasShapeMock,
            setCurrentObject: mockCurrentObject,
          }}
        >
          <ShapeKeyboardControl canvasShapeId={'shapeId'} />
        </CanvasObjectContext.Provider>
        ,
      </QueryWrapper>,
    );

    await user.keyboard("[Backspace]");

    expect(mockCurrentObject).toHaveBeenCalledWith(null);
  });
});
