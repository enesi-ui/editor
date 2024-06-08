import { describe, test, expect } from "vitest";
import { setup } from "~/tests/setup.ts";
import { Editor } from "~/editor/Editor.tsx";
import { QueryWrapper } from "~/tests/QueryWrapper.tsx";
import { ToolContextProvider } from "~/tool/ToolContextProvider.tsx";
import { CanvasObjectContextProvider } from "~/canvas/CanvasObjectContextProvider.tsx";

describe("Editor", () => {
  test("renders without crashing", () => {
    setup(
      <QueryWrapper>
        <ToolContextProvider>
          <CanvasObjectContextProvider>
            <Editor />
          </CanvasObjectContextProvider>
        </ToolContextProvider>
      </QueryWrapper>,
    );

    expect(true).toBe(true);
  });
});
