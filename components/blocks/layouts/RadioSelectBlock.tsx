import { FormBlockInstance, FormBlockType, FormCategoryType, ObjectBlockType } from "@/@types/form-block.type"
import { Label } from "../../ui/label"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { ChevronDown, CircleIcon } from "lucide-react"
import { useBuilder } from "@/context/builder-provider"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Form, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"

const blockCategory: FormCategoryType="Field"
const blockType: FormBlockType="RadioSelect"

type attributesType={
    label:string;
    options:string[];
    required:boolean;
}

type propertiesValidateSchemaType=z.infer<typeof propertiesValidateSchema>

const propertiesValidateSchema=z.object({
    label:z.string().min(2).max(255),
    required:z.boolean(),
    options:z.array(z.string().min(1)),
}) 

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

function RadioSelectPropertiesComponent({
    positionIndex,
    parentId,
    blockInstance,
}:{
    blockInstance:FormBlockInstance  
    positionIndex?:number;
    parentId?:string;
}) {
    const block=blockInstance as newInstance;
    const { updateChildBlock } = useBuilder();

    const form = useForm<propertiesValidateSchemaType>({
        resolver :zodResolver(propertiesValidateSchema),
        mode: 'onBlur',
        defaultValues: {
            label: block.attributes?.label,
            required: block.attributes.required ?? false,
            options: block.attributes?.options || [],
        }
    })

    useEffect(()=>{
        form.reset({
            label: block.attributes?.label,
            required: block.attributes.required ?? false,
            options: block.attributes?.options || [],
        })
    }, [block.attributes, form])

    function setChanges(values: propertiesValidateSchemaType) {
        if(!parentId) return null;

        updateChildBlock(parentId, block.id, {
            ...block,
            attributes: {
                ...block.attributes,
                ...values,
            }
        })
    }

    return (
        <div className="w-full pb-4">
            <div className="w-full flex items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px]">
                <span className="text-sm font-medium text-gray-600 tracking-wider">Radio {positionIndex}</span>
                <ChevronDown className="w-4 h-4"/>
            </div>
            <Form {...form}>
                <form onSubmit={(e)=>e.preventDefault()} className="w-full space-y-3 px-4">
                    <FormField 
                        control={form.control} 
                        name="label" 
                        render={({field})=>(
                            <FormItem className="text-end">
                                <div className="flex items-baseline justify-between w-full gap-2">
                                    <FormLabel className="text-[13px] font-normal">
                                        Label
                                    </FormLabel>
                                    <div className="w-full max-w-[187px]">
                                        <Input
                                            {...field}
                                            onChange={(e)=>{
                                                field.onChange(e);
                                                setChanges({
                                                    ...form.getValues(),
                                                    label: e.target.value,
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}