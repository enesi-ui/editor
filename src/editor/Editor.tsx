import { usePixi } from "~/pixi/pixiContext.ts";
import { useEffect, useRef, useState } from "react";
import { CreateShape } from "~/shape/CreateShape.tsx";
import { PropertiesPanel } from "~/properties-panel/PropertiesPanel.tsx";
import { Toolbar } from "~/toolbar/Toolbar.tsx";
import { LayersPanel } from "~/layers-panel/LayersPanel.tsx";
import useWindowDimensions from "~/utility/use-window-dimensions.ts";
import { useCanvasShapes } from "~/canvas/useCanvasShapes.ts";
import { useToolsContext } from "~/tool/useToolsContext.ts";
import { MousePosition } from "~/tool/Tools.ts";
import { Layers } from "~/layers/Layers.tsx";
import { useSelection } from "~/canvas/useSelection.ts";

function Editor() {
  const app = usePixi();
  const pixiRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();
  const [canvasWidth, setCanvasWidth] = useState(width);
  const { deselectAll } = useSelection();

  const { position } = useToolsContext();

  useEffect(() => {
    if (!pixiRef.current) return;
    pixiRef.current.appendChild(app.view);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    setCanvasWidth(width);
    app.resizeTo = pixiRef.current;
    app.stage.on("pointerdown", async () => {
      await deselectAll();
    });
  }, [app, pixiRef, width, deselectAll]);

  useCanvasShapes();

  return (
    <div data-testid="editor-canvas">
      <Toolbar>
        <CreateShape />
      </Toolbar>
      <LayersPanel>
        <Layers />
      </LayersPanel>
      <PropertiesPanel />
      <div
        onMouseEnter={() => (position.current = MousePosition.CANVAS)}
        onMouseLeave={() => (position.current = MousePosition.LEFT_PANEL)}
        ref={pixiRef}
        id={"pixi-container"}
        style={{ width: canvasWidth, left: 0 }}
        className="bottom-0 absolute top-[calc(var(--toolbar-height))]"
      ></div>
    </div>
  );
}

export { Editor };
