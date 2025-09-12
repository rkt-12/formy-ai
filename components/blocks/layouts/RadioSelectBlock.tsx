import { FormBlockInstance, FormBlockType, FormCategoryType, ObjectBlockType } from "@/@types/form-block.type"
import { Label } from "../../ui/label"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { CircleIcon } from "lucide-react"

const blockCategory: FormCategoryType="Field"
const blockType: FormBlockType="RadioSelect"

type attributesType={
    label:string;
    options:string[];
    required:boolean;
}

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

type newInstance=FormBlockInstance & {attributes:attributesType}

function RadioSelectCanvasComponent({
    blockInstance,
}:{
    blockInstance:FormBlockInstance
}) {
    const block=blockInstance as newInstance;
    const {label,options,required}=block.attributes;

    return (
        <div className="flex flex-col gap-3 w-full">
            <Label className="text-base !font-normal mb-2">
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>

            <RadioGroup disabled={true} className="space-y-3 disabled:cursor-default !pointer-events-none !cursor-default">
                {options?.map((option:string, index:number)=>(
                    <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem disabled value={option} id={option}/>
                        <Label htmlFor={option} className="!font-normal">{option}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

function RadioSelectFormComponent() {
    return <div>Radio Form</div>
}

function RadioSelectPropertiesComponent() {
    return <div>Radio Properties</div>
}