import { useCanvases } from "~/canvas/useCanvases.ts";
import { Property } from "~/properties-panel/Property.tsx";
import { useCanvasPost } from "~/canvas/useCanvasPost.ts";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Start = () => {
  const { canvases } = useCanvases();
  const { post } = useCanvasPost();
  const [value] = useState("New Canvas");
  const navigate = useNavigate();

  const handleCreateCanvas = async (value: string) => {
    if (!value) return;
    const data = await post({ name: value });
    if (data) {
      navigate(`/editor/${data.id}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      {canvases && canvases.length > 0 && (
        <ul className="menu bg-base-200 p-0 rounded w-56 mb-3 gap-1">
          {canvases?.map((canvas) => (
            <li key={canvas.id}>
              <Link to={`/editor/${canvas.id}`}>{canvas.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <div className="gap-2 flex flex-row">
        <Property
          showBorders
          label="New"
          hideLabel
          id="canvas"
          type="text"
          value={value}
          onChange={handleCreateCanvas}
        />
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleCreateCanvas(value)}
        >
          Create
        </button>
      </div>
    </div>
  );
};
