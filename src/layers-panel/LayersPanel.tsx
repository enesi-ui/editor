import React, { useCallback } from "react";

export type LayerPanelProps = {
  children: React.ReactNode;
};
export const LayersPanel = ({ children }: LayerPanelProps) => {

  const ref = useCallback((node: HTMLInputElement) => {
    if (node) {
      node.checked = true;
    }
  }, []);

  return (
    <div
      role="region"
      aria-label="Layer Panel"
      tabIndex={0}
      className="absolute cursor-pointer border-panel top-[var(--toolbar-height)] mx-2 mt-2 left-0 bg-base-100 z-10 min-w-[240px] max-w-[300px] collapse collapse-arrow"
    >
      <input type="checkbox" ref={ref} />
      <div className="collapse-title text-l">Layers Panel</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
};
