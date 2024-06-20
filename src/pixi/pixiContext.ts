import { createContext, useContext } from "react";
import * as PIXI from "pixi.js";

PIXI.settings.ROUND_PIXELS = true;
export const app = new PIXI.Application<HTMLCanvasElement>({
  powerPreference: 'high-performance',
  background: '#1e1e1e',
  autoDensity: true,
  resolution: 3,
});

export const PixiContext = createContext(app);

export const usePixi = () => {
  return useContext(PixiContext);
};
