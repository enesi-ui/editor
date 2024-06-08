import { CanvasObjectContextProvider } from "~/canvas/CanvasObjectContextProvider.tsx";
import { ToolContextProvider } from "~/tool/ToolContextProvider.tsx";
import { PixiProvider } from "~/pixi/PixiProvider.tsx";
import { Editor } from "~/editor/Editor.tsx";

function EditorRoot() {
  return (
    <CanvasObjectContextProvider>
      <ToolContextProvider>
        <PixiProvider>
          <Editor />
        </PixiProvider>
      </ToolContextProvider>
    </CanvasObjectContextProvider>
  );
}

export { EditorRoot };
