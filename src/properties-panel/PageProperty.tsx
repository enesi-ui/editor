import { usePixi } from "~/pixi/pixiContext.ts";

export const PageProperty = () => {
  const app = usePixi();
  const handleBgColorChange = (color: string) => {
    app.renderer.background.color = color;
  };

  return (
    <div>
      <h2 className="p-2">Page</h2>
      <div className="flex flex-row justify-between p-2">
        <input
          className="w-12"
          id="properties-panel-bg-color"
          type="color"
          value={app.renderer.background.color as string}
          onChange={(e) => handleBgColorChange(e.target.value)}
        />
        <p className="">{app.renderer.background.color as string}</p>
      </div>
    </div>
  )
}
