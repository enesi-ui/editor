import { renderHook, waitFor, act } from "@testing-library/react";
import {
  render,
  RenderOptions,
  screen,
  fireEvent,
} from "@testing-library/react";
import { ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

class Application {
  constructor(public renderer: Record<string, unknown>) {}
  public view: HTMLElement = document.createElement("canvas");
  public stage = {
    eventMode: "static",
    hitArea: "",
  };
}

vi.mock("pixi.js", () => {
  return {
    Application,
    settings: {
      ROUND_PIXELS: true,
    },
  };
});

const setup = (ui: ReactElement, options?: Omit<RenderOptions, "queries">) => {
  return { user: userEvent.setup(), ...render(ui, options) };
};

export { render, screen, setup, fireEvent, renderHook, waitFor, act };
