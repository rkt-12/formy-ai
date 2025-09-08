import { FormBlockType, FormCategoryType, ObjectBlockType } from "@/@types/form-block.type"
import { CircleIcon } from "lucide-react"

const blockCategory: FormCategoryType="Field"
const blockType: FormBlockType="RadioSelect"

export const RadioSelectBlock: ObjectBlockType={
    blockCategory,
    blockType,
    createInstance:(id:string)=>({
        id,
        blockType,
        attributes:{
            label: 'Select an option',
            options: ["Option 1", "Option 2"],
            required: false,
        } 
    }),

    blockBtnElement:{
        icon:CircleIcon,
        label:"Radio",
    },

    canvasComponent: RadioSelectCanvasComponent,
    formComponent: RadioSelectFormComponent,
    propertiesComponent: RadioSelectPropertiesComponent,
}

function RadioSelectCanvasComponent() {
    return <div>Radio Canvas</div>
}

function RadioSelectFormComponent() {
    return <div>Radio Form</div>
}

function RadioSelectPropertiesComponent() {
    return <div>Radio Properties</div>
}