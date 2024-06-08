import { CanvasShape } from "~/shape/CanvasShape.ts";
import { imageTracer } from "imagetracer";

export interface ExportSvgProps {
  shape: CanvasShape;
}
export const ExportSvg = (props: ExportSvgProps) => {
  const handleSvg = async (shape: CanvasShape) => {
    const imageData = shape.getImageData();
    const svg = imageTracer.imageDataToSVG(imageData);
    console.log(svg);
  };

  return (
    <button
      onClick={() => handleSvg(props.shape)}
      className="col-end-[span_2] bg-primary-500 hover:bg-primary-100 m-2"
    >
      SVG Export
    </button>
  );
};
