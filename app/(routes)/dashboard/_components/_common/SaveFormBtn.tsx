"use client";
import { saveForm } from "@/actions/form.action";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/context/builder-provider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader, Save } from "lucide-react";
import React from "react";

const SaveFormBtn = () => {
  const { formData, setFormData, blockLayouts } = useBuilder();
  const formId = formData?.formId;
  const [isLoading, setIsLoading] = React.useState(false);
  
  const saveFormData = async () => {
    try {
      if (!formId) return;
      setIsLoading(true);

      const lockedBlockLayout = blockLayouts.find((block) => block.isLocked);
     
      const name = lockedBlockLayout?.childBlocks?.find(
        (child) => child.blockType === "Heading"
      )?.attributes?.label as string;

      const description = lockedBlockLayout?.childBlocks?.find(
        (child) => child.blockType === "Paragraph"
      )?.attributes?.label as string;

      const jsonBlocks = JSON.stringify(blockLayouts);

      const response = await saveForm({
        formId,
        name,
        description,
        jsonBlocks,
      })

      if(response?.success){
        toast({
            title: "Success",
            description: response.message,
        })
        if(response.form){
            setFormData({
                ...formData,
                ...response.form
            })
        }
      }
        else{
        toast({
            title: "Error",
            description: response?.message || "Failed to save form",
            variant: "destructive"
        })
      }
    } catch (error:any) {
        toast({
            title: "Error",
            description: error?.message ||"Something went wrong",
            variant: "destructive"
        })
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading||formData?.published}
      className={cn(`!h-8 !text-primary !bg-primary/10 !border-primary`,formData?.published && "cursor-default pointer-events-none")}
      onClick={saveFormData}
    >
        {isLoading?<Loader className="animate-spin h-4 w-4"/> :<Save />}
       Save
    </Button>
  );
};

export default SaveFormBtn;
