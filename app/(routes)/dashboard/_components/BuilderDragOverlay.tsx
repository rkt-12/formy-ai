import { FormBlockType } from "@/@types/form-block.type";
import BlockBtnDragOverlay from "@/components/BlockBtnDragOverlay";
import { FormBlocks } from "@/lib/form-blocks";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";

const BuilderDragOverlay = () => {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      console.log("ITEM DRAG", event);
      setDraggedItem(event.active);
    },
    onDragCancel: (event) => {
      console.log("ITEM DRAG CANCEL");
      setDraggedItem(null);
    },
    onDragEnd: (event) => {
      console.log("ITEM DRAG");
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let fallbackNode = <div>No block drag</div>;
  const isBlockBtnElement=draggedItem?.data?.current?.isBlockBtnElement;
  if(isBlockBtnElement){
    const blockType=draggedItem?.data?.current?.blockType as FormBlockType;
    fallbackNode = <BlockBtnDragOverlay formBlock={FormBlocks[blockType]}/>
}

  return (
    <DragOverlay>
      <div className="opacity-95">{fallbackNode}</div>
    </DragOverlay>
  );
};

export default BuilderDragOverlay;
