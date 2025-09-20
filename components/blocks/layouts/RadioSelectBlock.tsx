import { FormBlockInstance, FormBlockType, FormCategoryType, ObjectBlockType } from "@/@types/form-block.type"
import { Label } from "../../ui/label"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { ChevronDown, CircleIcon, X } from "lucide-react"
import { useBuilder } from "@/context/builder-provider"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Switch } from "@/components/ui/switch"
import { generateUniqueId } from "@/lib/helper"

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

function RadioSelectFormComponent({
    blockInstance,
}:{
    blockInstance:FormBlockInstance
}) {
    const block=blockInstance as newInstance;
    const {label,options,required}=block.attributes;
    const [isError, setIsError]=useState(false);
    const [value, setValue]=useState("");

    const validateField = (val:string) => {
        if(required){
            return val.trim() !== "";
        }
        return true;
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <Label className={`text-base !font-normal mb-2 ${isError ? 'text-red-500' : ''}`}>
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>

            <RadioGroup 
                className="space-y-3"
                onValueChange={(value)=>{
                    setValue(value);
                    const isValid=validateField(value);
                    setIsError(!isValid);
                }}
            >
                {options?.map((option:string, index:number)=>{
                    
                    const uniqueId=`option-${generateUniqueId()}`;
                    
                    return (
                        <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem 
                                value={option} 
                                id={uniqueId}
                                className={`!cursor-pointer ${isError ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <Label htmlFor={uniqueId} className="!font-normal !cursor-pointer">{option}</Label>
                        </div>
                    )
                })}
            </RadioGroup>
            {isError ? <p className="text-red-500 text-[0.8rem]">
                {required && value.trim().length===0 ? 'This field is required' : ""}
            </p>:null}
        </div>
    )
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
                    <FormField 
                        control={form.control} 
                        name="options" 
                        render={({field})=>(
                            <FormItem className="text-end">
                                <div className="flex items-baseline justify-between w-full gap-2">
                                    <FormLabel className="text-[13px] font-normal">
                                        Options
                                    </FormLabel>
                                    <div className="flex flex-col gap-1">
                                        {field?.value?.map((option:string, index:number)=>(
                                            <div className="relative flex items-center justify-between gap-2" key={index}>
                                                <Input
                                                    value={option}
                                                    onChange={(e)=>{
                                                        const updatedOptions=[...(field.value || [])];
                                                        updatedOptions[index]=e.target.value;
                                                        field.onChange(updatedOptions);
                                                        setChanges({
                                                            ...form.getValues(),
                                                            options: updatedOptions,
                                                        })
                                                    }}
                                                    className="max-w-[187px]"
                                                />
                                                <Button type="button" variant="ghost" size="icon" className="!p-0 rounded-full absolute -right-1 -top-1 !bg-black w-4 h-4" 
                                                    onClick={()=>{
                                                        const updatedOptions=field.value?.filter((_, i)=>i!==index);
                                                        field.onChange(updatedOptions);
                                                        setChanges({
                                                            ...form.getValues(),
                                                            options: updatedOptions,
                                                        })
                                                    }}
                                                    >
                                                    <X color="white" className="!w-2.5 !h-2.5"/>
                                                </Button>
                                            </div>
                                        ))}
                                        <FormMessage />
                                        <Button type="button" variant="outline" size="sm" className="mt-2"
                                            onClick={()=>{
                                                const currentOptions=field.value || [];
                                                const newOption=`Option ${currentOptions.length + 1}`;
                                                const updatedOptions=[...currentOptions, newOption];
                                                field.onChange(updatedOptions);
                                                setChanges({
                                                    ...form.getValues(),
                                                    options: updatedOptions,
                                                })
                                            }}
                                        >
                                            Add Option
                                        </Button>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control} 
                        name="required" 
                        render={({field})=>(
                            <FormItem className="text-end">
                                <div className="flex items-baseline justify-between w-full gap-2">
                                    <FormLabel className="text-[13px] font-normal">
                                        Required
                                    </FormLabel>
                                    <FormControl>
                                        <Switch 
                                        checked={field.value}
                                        onCheckedChange={(value)=>{
                                            field.onChange(value);
                                            setChanges({
                                                ...form.getValues(),
                                                required: value,
                                            })
                                        }}      
                                    />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}