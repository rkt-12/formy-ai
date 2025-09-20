import { FormBlockInstance, FormBlockType, FormCategoryType, ObjectBlockType } from "@/@types/form-block.type";
import ChildCanvasComponentWrapper from "@/components/ChildCanvasComponentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { allBlockLayouts } from "@/constant";
import { useBuilder } from "@/context/builder-provider";
import { FormBlocks } from "@/lib/form-blocks";
import { generateUniqueId } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Active, DragEndEvent, useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { Copy, GripHorizontal, Rows2, Trash2Icon, X } from "lucide-react";
import { useState } from "react";
import ChildPropertiesComponentWrapper from "@/components/ChildPropertiesComponentWrapper";
import ChildFormComponentWrapper from "@/components/ChildFormComponentWrapper";

const blockCategory: FormCategoryType="Layout"
const blockType: FormBlockType="RowLayout"

export const RowLayoutBlock : ObjectBlockType={
    blockCategory,
    blockType,

    createInstance:(id:string)=>({
        id: `layout-${id}`,
        blockType,
        attributes:{},
        isLocked:false,
        childBlocks:[],
    }),

    blockBtnElement:{
        icon: Rows2,
        label:"Row Layout"
    },

    canvasComponent: RowLayoutCanvasComponent,
    formComponent: RowLayoutFormComponent,
    propertiesComponent: RowLayoutPropertiesComponent,
}

function RowLayoutCanvasComponent(
  {blockInstance}:{blockInstance:FormBlockInstance}
) {

  const {removeBlockLayout , duplicateBlockLayout , selectedBlockLayout , handleSelectedLayout, updateBlockLayout}=useBuilder();
  const childBlocks=blockInstance.childBlocks || [];

  const isSelected=selectedBlockLayout?.id===blockInstance.id

  const droppable = useDroppable({
    id: blockInstance.id,
    disabled: blockInstance.isLocked,
    data: {
      isLAyoutDropArea: true,
    },
  });

  const [activeBlock, setActiveBlock] = useState<Active | null>(null);

  const draggable = useDraggable({
    id: blockInstance.id+"_drag-area",
    disabled: blockInstance.isLocked,
    data: {
      blockType: blockInstance.blockType,
      blockId: blockInstance.id,
      isCanvasLayout: true,
    }
  })

  useDndMonitor({
    onDragStart: (event) =>{
      setActiveBlock(event.active);
    },
    onDragEnd: (event: DragEndEvent) =>{
      const {active, over}=event;
      if(!active || !over){return}
      setActiveBlock(null);

      console.log(over,"over");
      console.log(active,"active");

      const isBlockBtnElement=active?.data?.current?.isBlockBtnElement;
      const isLayout=active?.data?.current?.blockType;

      const overBlockId=over?.id;
      if(isBlockBtnElement && !allBlockLayouts.includes(isLayout) && overBlockId===blockInstance.id){
        
        const newBlockType=active?.data?.current?.blockType;
        const newBlock=FormBlocks[newBlockType as FormBlockType].createInstance?.(generateUniqueId());
        const updatedChildrenBlock=[...childBlocks,newBlock]
        updateBlockLayout(blockInstance.id,updatedChildrenBlock)
      }
    }
  });

  function removeChildBlock(e:{stopPropagation:()=>void},id:string) {
    e.stopPropagation();
    const updatedChildrenBlock=childBlocks.filter((block)=>block.id!==id);
    updateBlockLayout(blockInstance.id,updatedChildrenBlock)
  }

  if(draggable.isDragging)return;

  return (
    <div ref={draggable.setNodeRef} className="max-w-full">
      {blockInstance.isLocked && <Border/>}
      <Card 
        ref={droppable.setNodeRef}
        className={cn(
          `w-full bg-white relative border shadow-sm min-h-[120px] max-w-[768px] rounded-md !p-0`,
          blockInstance.isLocked && "!rounded-t-none"
        )} 
        onClick={()=>{
          handleSelectedLayout(blockInstance);
        }}
      >
        <CardContent className="px-2 pb-2">
          {isSelected && !blockInstance.isLocked && (
            <div className="w-[5px] absolute left-0 top-0 rounded-l-md h-full bg-primary"/>
          )}
          {!blockInstance.isLocked && (
            <div {...draggable.listeners} {...draggable.attributes} className="flex items-center w-full h-[24px] cursor-move justify-center" role="button">
              <GripHorizontal size="20px" className="text-muted-foreground"/>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {!allBlockLayouts.includes(activeBlock?.data?.current?.blockType) && !blockInstance.isLocked &&  activeBlock?.data?.current?.isBlockBtnElement && droppable.isOver && (
              <div className="relative border border-dotted border-primary bg-primary/10 w-full h-20">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 text-xs bg-primary text-white text-center w-28 p-1 rounded-b-full shadow-md">
                  Drag it here
                </div>
              </div>
            )}
            {!droppable.isOver && childBlocks?.length==0 ? <PlaceHolder/> : (
              <div className="flex w-full flex-col items-center justify-start gap-4 py-4 px-3">
                {childBlocks?.map((childBlock)=>(
                  <div key={childBlock.id} className="flex items-center justify-center gap-1">
                    <ChildCanvasComponentWrapper blockInstance={childBlock}/>

                    {isSelected && !blockInstance.isLocked && (
                      <Button size="icon" variant="ghost" className="!bg-transparent" onClick={(e)=>{removeChildBlock(e,childBlock.id)}}>
                        <X/> 
                      </Button>
                    )}
                  </div>
                ))}
                
              </div>
            )}
          </div>
        </CardContent>
        {isSelected && !blockInstance.isLocked && (
          <CardFooter className="flex items-center gap-3 justify-end border-t py-3">
            <Button variant="outline" size="icon" onClick={(e)=>{
              e.stopPropagation();
              duplicateBlockLayout(blockInstance.id);
            }}>
              <Copy/>
            </Button>
            <Button variant="outline" size="icon" onClick={(e)=>{
              e.stopPropagation();
              removeBlockLayout(blockInstance.id);
            }}>
              <Trash2Icon/>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

function RowLayoutFormComponent({
  blockInstance,
}:{
  blockInstance:FormBlockInstance
}) {

  const childblocks = blockInstance.childBlocks || [];

  return (
    <div className="max-w-full">
      {blockInstance.isLocked && <Border/> }
      <Card 
        className={cn(
          `w-full bg-white relative border shadow-sm min-h-[120px] max-w-[768px] rounded-md !p-0`,
          blockInstance.isLocked && "!rounded-t-none"
        )} 
      >
        <CardContent className="px-2 pb-2">
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col items-center w-full justify-center gap-4 py-4 px-3">
              {childblocks.map((childblock)=>(
                <div key={childblock.id} className="w-full flex items-center justify-center gap-1 h-auto">
                  <ChildFormComponentWrapper blockInstance={childblock}/>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RowLayoutPropertiesComponent({blockInstance}:{blockInstance:FormBlockInstance}) {
  
  const childblocks = blockInstance.childBlocks || [];

  return (
    <div className="pt-3 w-full">
      <div className="flex flex-col w-full items-center justify-start gap-0 py-0 px-0">
        {childblocks.map((childBlock, index)=>(
          <div key={childBlock.id} className="w-full flex items-center justify-center gap-1 h-auto">
            <ChildPropertiesComponentWrapper index={index+1} parentId={blockInstance.id} blockInstance={childBlock}/>
          </div>
        ))}
      </div>
    </div>
  )
}

function Border(){
  return <div className="w-full rounded-t-md min-h-[8px] bg-primary"></div>
}

function PlaceHolder() {
  return (
    <div className="flex flex-col items-center justify-center border border-dotted border-primary bg-primary/10 hover:bg-primary/5 w-full h-28 text-primary font-medium text-base gap-1">
      <p className="text-center text-primary/80">
        Drag and drop a field here to get started
      </p>
    </div>
  );
}
