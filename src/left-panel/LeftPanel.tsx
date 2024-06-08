import React from "react";

export type LayerPanelProps = {
  children: React.ReactNode;
  width?: number;
};
export const LeftPanel = ({ children, width }: LayerPanelProps) => {
  return (
    <div
      role="region"
      aria-label="Layer Panel"
      style={{ width: width ?? "auto" }}
      className="absolute top-[var(--toolbar-height)] left-0 bottom-0 bg-primary-200"
    >
      {children}
    </div>
  );
};
