import { useState } from "react";
import { Layer } from "~/layers/Layer.tsx";
import { useObjects } from "~/enesi-object/useObjects.tsx";
import { useObjectUpdate } from "~/enesi-object/useObjectUpdate.ts";

export function Layers() {
  const { objects } = useObjects();
  const { updateZIndex } = useObjectUpdate();

  const orderedLayers = objects?.sort((a, b) => a.zIndex - b.zIndex);

  const [dragging, setDragging] = useState<string | null>(null);
  const [drop, setDrop] = useState<string | null>(null);

  const handleDragStart = (objectId: string) => {
    setDragging(objectId);
  };

  const handleDragEnter = (objectId: string) => {
    setDrop(objectId);
  };

  const handleDragEnd = async () => {
    if (!dragging || !drop || !orderedLayers) return;
    const aboveObject = orderedLayers.find((object) => object.id === drop);
    if (!aboveObject) return;
    updateZIndex({
      id: dragging,
      aboveObjectId: aboveObject.id,
    });
    setDragging(null);
    setDrop(null);
  };


  return (
    <ul className="menu rounded-lg w-full">
      {orderedLayers?.map((object) => (
        <div key={object.id} data-id={object.id}>
          <Layer
            objectId={object.id}
            onDragStart={() => handleDragStart(object.id)}
            onDragEnter={() => handleDragEnter(object.id)}
            onDragEnd={handleDragEnd}
          />
          {dragging && drop === object.id && (
            <div
              className="border-b border-neutral-content"
              style={{ height: 1 }}
            />
          )}
        </div>
      ))}
    </ul>
  );
}
