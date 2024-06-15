import { usePixi } from "~/pixi/pixiContext.ts";
import { useEffect, useRef, useState } from "react";
import { ShapeFactory } from "~/shape/ShapeFactory.tsx";
import { PropertiesPanel } from "~/properties-panel/PropertiesPanel.tsx";
import { Toolbar } from "~/toolbar/Toolbar.tsx";
import { LeftPanel } from "~/left-panel/LeftPanel.tsx";
import useWindowDimensions from "~/utility/use-window-dimensions.ts";
import { KeyboardControl } from "~/keyboard-control/KeyboardControl.tsx";
import { useCanvasShapes } from "~/canvas/useCanvasShapes.ts";
import { useToolsContext } from "~/tool/useToolsContext.ts";
import { MousePosition } from "~/tool/Tools.ts";

function Editor() {
  const app = usePixi();
  const pixiRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();
  const propertiesPanelWidth = 256;
  const leftPanelWidth = 144;
  const [canvasWidth, setCanvasWidth] = useState(
    width - propertiesPanelWidth - leftPanelWidth,
  );

  const { position } = useToolsContext();

  useEffect(() => {
    if (!pixiRef.current) return;
    pixiRef.current.appendChild(app.view);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    setCanvasWidth(width - propertiesPanelWidth - leftPanelWidth);
    app.resizeTo = pixiRef.current;
  }, [app, pixiRef, width]);

  useCanvasShapes();

  return (
    <div data-testid="editor-canvas">
      <Toolbar>
        <ShapeFactory />
      </Toolbar>
      <LeftPanel width={leftPanelWidth}>
        <div className="p-2">Layers</div>
      </LeftPanel>
      <PropertiesPanel width={propertiesPanelWidth} />
      <KeyboardControl />
      <div
        onMouseEnter={() => (position.current = MousePosition.CANVAS)}
        onMouseLeave={() => (position.current = MousePosition.LEFT_PANEL)}
        ref={pixiRef}
        id={"pixi-container"}
        style={{ width: canvasWidth, left: leftPanelWidth }}
        className="bottom-0 absolute top-[calc(var(--toolbar-height))]"
      ></div>
    </div>
  );
}

export { Editor };
