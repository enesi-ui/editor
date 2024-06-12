import { test, expect, vi, describe } from "vitest";
import { SelectableContextMenuItem } from "~/context-menu/SelectableContextMenuItem.tsx";
import { setup } from "~/tests/setup";
import { screen } from "@testing-library/react";

describe("SelectableContextMenuItem", () => {
  test("loads and displays greeting", async () => {
    const handleClick = vi.fn();
    setup(
      <SelectableContextMenuItem
        label={"ctrl"}
        icon={<div>icon</div>}
        onClick={handleClick}
      />,
    );

    expect(screen.getByText("ctrl")).toBeInTheDocument();
    expect(screen.getByText("icon")).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    const { user } = setup(
      <SelectableContextMenuItem
        label={"ctrl"}
        icon={<div>icon</div>}
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByText("ctrl"));

    expect(handleClick).toHaveBeenCalled();
  });
});
