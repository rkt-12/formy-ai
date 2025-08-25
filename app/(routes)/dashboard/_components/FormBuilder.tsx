"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";
import Builder from "./Builder";

const FormBuilder = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
