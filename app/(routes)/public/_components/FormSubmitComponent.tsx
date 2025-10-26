"use client";
import React, { useRef, useState } from "react";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import { FormBlocks } from "@/lib/form-blocks";
import { Loader } from "lucide-react";
import Logo from "@/components/logo";
import { toast } from "@/hooks/use-toast";

const FormSubmitComponent = (props: {
  formId: string;
  blocks: FormBlockInstance[];
}) => {
  const { formId, blocks } = props;

  const formVals=useRef<{[key:string]:string}>({})
  const [formErrors,setFormErrors]=useState<{[key:string]:string}>({})
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const validateFields=()=>{
    const errors:{[key:string]:string}={}
    blocks.forEach((block)=>{
      if(!block.childBlocks)return;
      block.childBlocks?.forEach((childblock)=>{
        const required=childblock.attributes?.required;
        const blockValue=formVals.current?.[childblock.id]?.trim();

        if(required && (!blockValue || blockValue.trim()==="")){
          errors[childblock.id]="This Field is required"
        }
      })
    })
    setFormErrors(errors);
    return Object.keys(errors).length===0;
  }

  const handleBlur=(key:string, value:string)=>{
    formVals.current[key]=value
    if(formErrors[key] && value.trim()!==""){
      setFormErrors((prevErrors)=>{
        const updatedErrors={...prevErrors}
        delete updatedErrors[key];
        return updatedErrors
      })
    }
  }

  const handleSubmit = async () =>{
    if(!validateFields()){
      toast({
        title:"Validation error",
        description: "Must fill in required fields",
        variant: "destructive",
      })
      return
    }

  }

  return (
    <div className="scrollbar w-full h-full overflow-y-auto pt-3 transition-all duration-300">
      <div className="w-full h-full max-w-[650px] mx-auto">
        <div className="w-full relative bg-transparent px-2 flex flex-col items-center justify-start pt-1 pb-14">
          <div className="w-full mb-3 bg-white bg-[url(/images/form-bg.jpg)] bg-center bg-cover border shadow-sm h-[135px] max-w-[768px] rounded-md px-1" />
          <div className="w-full h-auto">
            {blocks.length>0?(
              <div className="flex flex-col w-full gap-4">
                {blocks.map((block) => {
                  const FormBlockComponent =
                    FormBlocks[block.blockType].formComponent;
                  return (
                    <FormBlockComponent key={block.id} blockInstance={block} handleBlur={handleBlur} formErrors={formErrors}/>
                  );
                })}
              </div>
            ):null}
            <div className="w-full mt-4">
              <Button className="!bg-primary" disabled={isLoading} onClick={handleSubmit}>
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </div>
          </div>
          <div className="flex items-center flex-col gap-2 justify-center mt-5">
            <p className="text-xs">
              Never submit passwords through Formy.ai
            </p>
            <Logo url="#" color="!text-primary"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSubmitComponent;
