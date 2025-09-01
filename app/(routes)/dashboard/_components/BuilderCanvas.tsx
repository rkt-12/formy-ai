import { FormBlockInstance, FormBlockType } from "@/@types/form-block.type";
import { allBlockLayouts } from "@/constant";
import { useBuilder } from "@/context/builder-provider";
import { FormBlocks } from "@/lib/form-blocks";
import { generateUniqueId } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Active, DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";

const BuilderCanvas = () => {
  const { blockLayouts,addBlockLayout } = useBuilder();
  const [activeBlock, setActiveBlock]=useState<Active | null>(null);
  const droppable = useDroppable({
    id: "builder-canvas-droppable",
    data: {
      isBuilderCanvasDropArea: true,
    },
  });
  useDndMonitor({
    onDragStart:(event)=>{
      setActiveBlock(event.active)
    },
    onDragEnd:(event:DragEndEvent)=>{
      console.log("DRAG END",event);
      const {active,over}=event;
      if(!over || !active)return;
      setActiveBlock(null);

      const isBlockBtnElement = active?.data?.current?.isBlockBtnElement;
      const isBlockLayout= active?.data?.current?.blockType;

      const isDraggingOverCanvas = over?.data?.current?.isBuilderCanvasDropArea;

      if(isBlockBtnElement && allBlockLayouts.includes(isBlockLayout) && isDraggingOverCanvas){
        const blockType= active?.data?.current?.blockType;
        const newBlockLayout =FormBlocks[
          blockType as FormBlockType
        ].createInstance(generateUniqueId())
        console.log("NEW BLOCK LAYOUT INSTANCE",newBlockLayout)
        addBlockLayout(newBlockLayout);
        return;
      }
    }
  })

  return (
    <div className="relative w-full h-[calc(100vh_-_65px)] px-5 sm:px-0 pt-4 pb-[120px] overflow-auto transition-all duration-300 scrollbar">
      <div className="w-full h-full max-w-[650px] mx-auto">
        {/* Droppable canvas */}

        <div
          ref={droppable.setNodeRef}
          className={cn(
            `w-full relative bg-transparent px-2 rounded-md flex flex-col min-h-svh items-center justify-start pt-1 pb-14 ring-4 ring-primary/20 ring-inset`,
            droppable.isOver && "ring-4 ring-primary/20 ring-inset"
          )}
        >
          <div className="w-full mb-3 bg-white bg-[url(/images/form-bg.jpg)] bg-center bg-cover bg-no-repeat border shadow-sm h-[135px] max-w-[768px] rounded-md px-1 mt-2" />
          {blockLayouts.length > 0 && (
            <div className="flex flex-col w-full gap-4">
              {blockLayouts.map((blockLayout) => (
                <CanvasBlockLayoutWrapper
                  key={blockLayout.id}
                  activeBlock={activeBlock}
                  blockLayout={blockLayout}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function CanvasBlockLayoutWrapper({
  blockLayout,
  activeBlock,
}: {
  blockLayout: FormBlockInstance;
  activeBlock: Active | null;
}) {
  const CanvasBlockLayout = FormBlocks[blockLayout.blockType].canvasComponent;
  
  const topCorner=useDroppable({
    id: blockLayout.id+"_above",
    data:{
      blockType : blockLayout.blockType,
      blockId : blockLayout.id,
      isAbove :true,
    }
  })
  const bottomCorner=useDroppable({
    id: blockLayout.id+"_below",
    data:{
      blockType : blockLayout.blockType,
      blockId : blockLayout.id,
      isBelow :true,
    }
  })
  
  return (
    <div className="relative mb-1">
      <div ref={topCorner.setNodeRef} className="absolute top-0 w-full h-1/2 pointer-events-none">
        {topCorner.isOver && !blockLayout.isLocked &&
        allBlockLayouts.includes(activeBlock?.data?.current?.blockType) &&
        (
          <div className="absolute w-full -top-[3px] h-[6px] bg-primary rounded-t-md"/>
        )}
      </div>
      {/* Bottom Half Drop Zone */}
      <div className="absolute bottom-0 w-full h-1/2 pointer-events-none" ref={bottomCorner.setNodeRef}>
        {bottomCorner.isOver && !blockLayout.isLocked &&
        allBlockLayouts.includes(activeBlock?.data?.current?.blockType) &&
        (
          <div className="absolute w-full -bottom-[3px] h-[6px] bg-primary rounded-b-md"/>
        )}
      </div>
      <CanvasBlockLayout blockInstance={blockLayout}/>
    </div>
  );
}

export default BuilderCanvas;
