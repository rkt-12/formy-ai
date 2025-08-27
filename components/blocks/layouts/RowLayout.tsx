import { FormBlockType, FormCategoryType, ObjectBlockType } from "@/@types/form-block.type";
import { Rows2 } from "lucide-react";

const blockCategory: FormCategoryType="Layout"
const blockType: FormBlockType="RowLayout"

export const RowLayoutBlock : ObjectBlockType={
    blockCategory,
    blockType,

    createInstance:(id:string)=>({
        id: `row-layout-${id}`,
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

function RowLayoutCanvasComponent() {
  return <div>Canvas Component</div>
}

function RowLayoutFormComponent() {
  return <div>Form Component</div>
}

function RowLayoutPropertiesComponent() {
  return <div>Properties Component</div>
}