import { describe, test, expect, vi } from "vitest";
import { setup, screen } from "~/tests/setup";
import { CheckboxProperty } from "~/properties-panel/CheckboxProperty.tsx";

describe("CheckboxProperty", () => {
  test("renders", () => {
    setup(<CheckboxProperty label="Label" defaultValue={true} id="id" />);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Label")).toBeChecked();
  });

  test("renders unchecked per default", () => {
    setup(<CheckboxProperty label="Label" defaultValue={false} id="id" />);

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Label")).not.toBeChecked();
  });

  test("changes value", async () => {
    const handleChange = vi.fn();
    const { user } = setup(
      <CheckboxProperty label="Label" id="id" onChange={handleChange} defaultValue={false}/>,
    );

    await user.click(screen.getByLabelText("Label"));

    expect(handleChange).toHaveBeenCalledWith(true);

    handleChange.mockClear();

    await user.click(screen.getByLabelText("Label"));

    expect(handleChange).toHaveBeenCalledWith(false);
  });
});
