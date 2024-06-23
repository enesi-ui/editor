import { ToolContextProvider } from "~/tool/ToolContextProvider.tsx";
import { PixiProvider } from "~/pixi/PixiProvider.tsx";
import { Editor } from "~/editor/Editor.tsx";

function EditorRoot() {
  return (
    <ToolContextProvider>
      <PixiProvider>
        <Editor />
      </PixiProvider>
    </ToolContextProvider>
  );
}

export { EditorRoot };
