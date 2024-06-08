export const toolInToolbar = (active: boolean) => {
  return active
    ? "flex w-12 h-[var(--toolbar-height)] relative bg-base-200"
    : "flex w-12 h-[var(--toolbar-height)] relative bg-base-content";
};
