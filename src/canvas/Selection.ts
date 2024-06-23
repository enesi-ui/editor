export interface Selection {
  canvasId: string;
  shapeIds: string[];
}

export interface SelectionUpdate {
  selectShapes: string[];
  deselectShapes: string[];
  deselectAll: boolean;
  canvasId: string;
}
