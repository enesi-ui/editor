import { describe, it, expect } from "vitest";
import { setup } from "~/tests/setup.tsx";
import { LayersPanel } from "~/layers-panel/LayersPanel.tsx";
import { screen } from "@testing-library/react";

describe("LayersPanel", () => {
  it("should render correctly", () => {
    setup(
      <LayersPanel>
        <div>Some content</div>
      </LayersPanel>,
    );

    expect(screen.getByText("Layers Panel")).toBeInTheDocument();
  });

  it("should render content", () => {
    setup(
      <LayersPanel>
        <div>Some content</div>
      </LayersPanel>,
    );

    expect(screen.getByText("Some content")).toBeInTheDocument();
  });

  it("renders with checked state intially", async () => {
    setup(
      <LayersPanel>
        <div>Some content</div>
      </LayersPanel>,
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  it("can uncheck the input for showing and hiding the content", async () => {
    const { user } = setup(
      <LayersPanel>
        <div>Some content</div>
      </LayersPanel>,
    );

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });
});
