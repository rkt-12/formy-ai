"use client";
import { updatePublish } from "@/actions/form.action";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/context/builder-provider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader, Send } from "lucide-react";
import React, { useState } from "react";

const PublishFormBtn = () => {
  const { formData, setFormData, handleSelectedLayout } = useBuilder();
  const formId = formData?.formId;
  const [isLoading, setIsLoading] = useState(false);
  const isPublished = formData?.published;
  const togglePublishState = async () => {
    try {
        if(!formId) return;
        setIsLoading(true);
        const newPublishState = !formData?.published;
        const response = await updatePublish(formId, newPublishState);

        if(response?.success){
            toast({
                title: "Success",
                description: response.message,
            });
            handleSelectedLayout(null);
            setFormData({
                ...formData,
                published: response.published || false,
            });
        }
        else{
            toast({
                title: "Error",
                description: response?.message || "Failed to update publish state",
                variant: "destructive",
            });
        }

    } catch (error :any) {
        toast({
            title: "Error",
            description: error?.message || "Something went wrong",
            variant: "destructive",
        });
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      size="sm"
      variant={isPublished ? "destructive" : "default"}
      className={cn(
        isPublished ? "bg-red-500 hover:bg-red-600" : "!bg-primary",
        "text-white"
      )}
      onClick={togglePublishState}
    >
      {isLoading ? (
        <Loader className="animate-spin w-4 h-4" />
      ) : isPublished ? (
        "Unpublish"
      ) : (
        <>
          <Send /> Publish
        </>
      )}
    </Button>
  );
};

export default PublishFormBtn;
