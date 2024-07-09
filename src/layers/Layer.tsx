import { useSelection } from "~/canvas/useSelection.ts";
import { RectangleIcon } from "~/icon/RectangleIcon.tsx";
import { SelectableListItemInput } from "~/input/SelectableListItemInput.tsx";
import { DragEvent, useRef, useState } from "react";
import { useObject } from "~/enesi-object/useObject.ts";
import { useObjectUpdate } from "~/enesi-object/useObjectUpdate.ts";

export function Layer({
  canvasId,
  objectId,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  canvasId: string;
  objectId: string;
  onDragStart?: () => void;
  onDragEnter?: () => void;
  onDragEnd?: () => void;
}) {
  const { object } = useObject(objectId);
  const { update, isPending, variables } = useObjectUpdate();
  const { deselectAllSelect, selectedShapes } = useSelection(canvasId);
  const dragEffectRef = useRef<HTMLImageElement>(null);

  const [cursorEffect, setCursorEffect] = useState<
    "cursor-pointer" | "cursor-move"
  >("cursor-pointer");

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    onDragStart?.();
    if (event.dataTransfer && dragEffectRef.current) {
      event.dataTransfer.setDragImage(dragEffectRef.current, 0, 0);
      setCursorEffect("cursor-move");
    }
  };

  const handleDragEnd = () => {
    onDragEnd?.();
    setCursorEffect("cursor-pointer");
  };

  return (
    object && (
      <div
        onDragStart={handleDragStart}
        onDragEnter={onDragEnter}
        onDragEnd={handleDragEnd}
        draggable={true}
      >
        <img
          ref={dragEffectRef}
          className="block absolute left-0 top-0"
          src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
          alt={"dummy"}
        />
        <SelectableListItemInput
          key={object.id}
          value={isPending && variables?.name ? variables.name : object.name}
          onClick={() => deselectAllSelect(object.id)}
          icon={<RectangleIcon />}
          active={selectedShapes?.includes(object.id)}
          onChange={(value) => update({ id: object.id, name: value })}
          cursorEffect={cursorEffect}
        />
      </div>
    )
  );
}
