import React from "react";

export type ToolbarProps = {
  children: React.ReactNode;
};

export const Toolbar = ({ children }: ToolbarProps) => {
  return (
    <div
      role="region"
      aria-label="Main Toolbar"
      className="absolute w-full h-[var(--toolbar-height)] select-none flex justify-between flex-row z-[8] border-b-base-content/20 box-content border-b border-solid left-0 top-0 bg-base-100 items-center"
    >
      {children}
    </div>
  );
};
