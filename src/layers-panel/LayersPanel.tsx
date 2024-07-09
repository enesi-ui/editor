import React from "react";

export type LayerPanelProps = {
  children: React.ReactNode;
};
export const LayersPanel = ({ children }: LayerPanelProps) => {
  return (
    <div
      role="region"
      aria-label="Layer Panel"
      tabIndex={0}
      className="absolute border-panel top-[var(--toolbar-height)] m-2 left-0 bg-base-100 py-2 z-10 min-w-[240px] max-w-[300px] collapse collapse-arrow collapse-open"
    >
      <input type="checkbox" />
      <div className="collapse-title text-l">Layers Panel</div>
      <div className="collapse-content ">{children}</div>
    </div>
  );
};
