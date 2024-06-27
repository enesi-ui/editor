export const shapeKeys = {
  all: ["shapes"] as const,
  detail: (id: string) => [...shapeKeys.all, id] as const,
};

export const selectionKeys = {
  all: ["selection"] as const,
  canvas: (canvasId: string) => [...selectionKeys.all, canvasId] as const,
};
