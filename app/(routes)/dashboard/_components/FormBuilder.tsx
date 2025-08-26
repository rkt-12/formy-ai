"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";
import Builder from "./Builder";
import { useBuilder } from "@/context/builder-provider";
import { Loader } from "lucide-react";

const FormBuilder = () => {
  
  const {formData,loading}=useBuilder();
  const isPublished = formData?.published;

  if(loading){
    return <div className="w-full flex h-56 items-center justify-center">
      <Loader className="animate-spin" size="3rem" />
    </div>
  }
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(isPublished ? false : true);
  
  return (
    <div>
      <SidebarProvider
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        className="h-[calc(100vh_-_64px)]"
        style={
            {
                "--sidebar-width": "300px",
                "--sidebar-height": "40px",
            } as React.CSSProperties
        }
      >
        <Builder {...{isSidebarOpen}}/>
      </SidebarProvider>
    </div>
  );
};

export default FormBuilder;
