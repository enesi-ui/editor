import { ToolContextProvider } from "~/tool/ToolContextProvider.tsx";
import { PixiProvider } from "~/pixi/PixiProvider.tsx";
import { Editor } from "~/editor/Editor.tsx";
import { useParams } from "react-router-dom";

function EditorRoot() {
  const { id } = useParams();

  return (
    <ToolContextProvider>
      <PixiProvider>
        {id && <Editor canvasId={id} />}
      </PixiProvider>
    </ToolContextProvider>
  );
}

export { EditorRoot };
