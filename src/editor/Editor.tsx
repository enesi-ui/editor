import { usePixi } from "~/pixi/pixiContext.ts";
import { useEffect, useRef, useState } from "react";
import { ShapeFactory } from "~/shape/ShapeFactory.tsx";
import { PropertiesPanel } from "~/properties-panel/PropertiesPanel.tsx";
import { Toolbar } from "~/toolbar/Toolbar.tsx";
import { LeftPanel } from "~/left-panel/LeftPanel.tsx";
import useWindowDimensions from "~/utility/use-window-dimensions.ts";
import { KeyboardControl } from "~/keyboard-control/KeyboardControl.tsx";

function Editor() {
  const app = usePixi();
  const pixiRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();
  const [propertiesPanelWidth] = useState(240);
  const [leftPanelWidth] = useState(144);
  const [canvasWidth, setCanvasWidth] = useState(
    width - propertiesPanelWidth - leftPanelWidth,
  );

  useEffect(() => {
    if (!pixiRef.current) return;
    pixiRef.current.appendChild(app.view);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    setCanvasWidth(width - propertiesPanelWidth - leftPanelWidth);
    app.resizeTo = pixiRef.current;
  }, [app, pixiRef, width, leftPanelWidth, propertiesPanelWidth]);

  return (
    <div
      data-testid="editor-canvas"
      className="flex-row items-center justify-center"
    >
      <Toolbar>
        <ShapeFactory />
      </Toolbar>
      <LeftPanel width={leftPanelWidth}>
        <div>left panel</div>
      </LeftPanel>
      <PropertiesPanel width={propertiesPanelWidth} />
      <KeyboardControl />
      <div
        ref={pixiRef}
        id={"pixi-container"}
        style={{ width: canvasWidth, left: leftPanelWidth }}
        className="bottom-0 absolute top-[calc(var(--toolbar-height))]"
      ></div>
    </div>
  );
}

export { Editor };
