import { CanvasShape } from "~/shape/CanvasShape.ts";
import { useDeployCustomElement } from "~/export/useDeployCustomElement.ts";

export interface ExportCustomElementProps {
  shape: CanvasShape;
  name: string;
}
export const ExportCustomElement = (props: ExportCustomElementProps) => {
  const { shape, name } = props;
  const { deploying, deploy } = useDeployCustomElement(shape, { name });

  return (
    <button
      disabled={deploying}
      onClick={deploy}
      className="bg-primary-500 hover:bg-primary-100 col-end-[span_2] m-2"
    >
      {deploying ? "Deploying..." : "Export to Web Component"}
    </button>
  );
};
