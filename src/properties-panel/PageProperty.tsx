import { usePixi } from "~/pixi/pixiContext.ts";
import { ColorProperty } from "~/properties-panel/ColorProperty.tsx";
import { isValidHexCode } from "~/utility/hex.ts";
import { useState } from "react";

export const PageProperty = () => {
  const app = usePixi();
  const [pageBgColor, setPageBgColor] = useState(
    app.renderer.background.color as string ?? '#0000',
  );

  const handleBgColorChange = (color: string) => {
    const newColor = isValidHexCode(color)
      ? color
      : app.renderer.background.color as string ?? '#0000';
    setPageBgColor(newColor);
    app.renderer.background.color = newColor;
    console.log("color", color, app.renderer.background.color);
  };

  return (
    <ColorProperty
      id={"page-bg-color"}
      label="Page"
      value={pageBgColor}
      onChange={handleBgColorChange}
      showLabel
      className={"mt-2 mx-2 h-12"}
    />
  );
};
