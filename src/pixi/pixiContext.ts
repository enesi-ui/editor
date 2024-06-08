import { createContext, useContext } from "react";
import * as PIXI from "pixi.js";

PIXI.settings.ROUND_PIXELS = true;
export const app = new PIXI.Application<HTMLCanvasElement>({
  powerPreference: 'high-performance',
  background: '#000000',
  resolution: 1,
});

export const PixiContext = createContext(app);

export const usePixi = () => {
  return useContext(PixiContext);
};
