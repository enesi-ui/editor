import { usePixi } from "~/pixi/pixiContext.ts";
import { ColorProperty } from "~/properties-panel/ColorProperty.tsx";

export const PageProperty = () => {
  const app = usePixi();
  const handleBgColorChange = (color: string) => {
    app.renderer.background.color = color;
  };

  return (
    <ColorProperty
      id={"page-bg-color"}
      label="Page"
      value={app.renderer.background.color as string}
      onChange={(value) => handleBgColorChange(value)}
      showLabel
      className={"mt-2 h-12"}
    />
  );
};
