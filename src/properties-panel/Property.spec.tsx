import { describe, test, expect, vi } from "vitest";
import { setup } from "~/tests/setup";
import { Property } from "~/properties-panel/Property.tsx";
import { screen } from "@testing-library/react";

describe("Property", () => {
  test("renders", () => {
    setup(<Property label="Label" id="id"  value={"value"}/>);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Label")).toHaveValue('value');
  });

  test("changes value", async () => {
    const handleChange = vi.fn();
    const { user } = setup(
      <Property label="Label" id="id" onChange={handleChange} value={'value'}/>,
    );

    await user.clear(screen.getByLabelText("Label"));
    await user.type(screen.getByLabelText("Label"), "new Value[enter]");

    expect(handleChange).toHaveBeenCalledWith("new Value");
  });

  describe("number", () => {
    test("cleans text input to number", async () => {
      const handleChange = vi.fn();
      const { user } = setup(
        <Property label="Label" id="id" onChange={handleChange} value={1} type="number"/>,
      );

      await user.clear(screen.getByLabelText("Label"));
      await user.type(screen.getByLabelText("Label"), "some-text[enter]");

      expect(handleChange).toHaveBeenCalledWith("1");
    });
  });
});
