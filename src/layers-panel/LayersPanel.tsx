import React from "react";

export type LayerPanelProps = {
  children: React.ReactNode;
};
export const LayersPanel = ({ children }: LayerPanelProps) => {
  return (
    <div
      role="region"
      aria-label="Layer Panel"
      className="absolute top-[var(--toolbar-height)] left-0 bottom-0 bg-base-100 p-2 z-10 min-w-76"
    >
      {children}
    </div>
  );
};