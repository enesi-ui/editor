export const shapeKeys = {
  all: ["shapes"] as const,
  detail: (id: string) => [...shapeKeys.all, id] as const,
};

export const selectionKeys = {
  all: ["selection"] as const,
  canvas: (canvasId: string) => [...selectionKeys.all, canvasId] as const,
};

export const objectKeys = {
  all: ["objects"] as const,
  detail: (id: string) => [...objectKeys.all, id] as const,
};

export const componentKeys = {
  all: ["components"] as const,
  detail: (id: string) => [...componentKeys.all, id] as const,
};

export const canvasKeys = {
  all: ["canvases"] as const,
  detail: (id: string) => [...canvasKeys.all, id] as const,
};
