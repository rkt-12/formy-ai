import { FormBlockInstance, FormBlockType, FormCategoryType, ObjectBlockType } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useBuilder } from "@/context/builder-provider";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { Copy, GripHorizontal, Rows2, Trash2Icon } from "lucide-react";

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

  const {removeBlockLayout , duplicateBlockLayout , selectedBlockLayout , handleSelectedLayout}=useBuilder();
  const childBlocks=blockInstance.childBlocks || [];

  const isSelected=selectedBlockLayout?.id===blockInstance.id
  const draggable = useDraggable({
    id: blockInstance.id+"_drag-area",
    disabled: blockInstance.isLocked,
    data: {
      blockType: blockInstance.blockType,
      blockId: blockInstance.id,
      isCanvasLayout: true,
    }
  })

  if(draggable.isDragging)return;

  return (
    <div ref={draggable.setNodeRef} className="max-w-full">
      {blockInstance.isLocked && <Border/>}
      <Card 
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
            {childBlocks?.length==0 ? <PlaceHolder/> : (
              <div className="flex w-full flex-col items-center justify-start gap-4 py-4 px-3">
                <div className="flex items-center justify-center gap-1">
                  {/* ChildBlocks */}
                </div>
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

function RowLayoutFormComponent() {
  return <div>Form Component</div>
}

function RowLayoutPropertiesComponent() {
  return <div>Properties Component</div>
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
