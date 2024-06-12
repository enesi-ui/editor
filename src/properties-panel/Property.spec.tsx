import { describe, test, expect, vi } from "vitest";
import { setup, screen } from "~/tests/setup";
import { Property } from "~/properties-panel/Property.tsx";

describe("Property", () => {
  test("renders", () => {
    setup(<Property label="Label" defaultValue={"Value"} id="id" />);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Label")).toHaveValue('Value');
  });

  test("changes value", async () => {
    const handleChange = vi.fn();
    const { user } = setup(
      <Property label="Label" id="id" onChange={handleChange} defaultValue={'Value'}/>,
    );

    await user.clear(screen.getByLabelText("Label"));
    await user.type(screen.getByLabelText("Label"), "new Value");

    expect(handleChange).toHaveBeenCalledWith("new Value");
  });
});
