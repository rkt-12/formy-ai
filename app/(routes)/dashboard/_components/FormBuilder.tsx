"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useState } from "react";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import Builder from "./Builder";
import { useBuilder } from "@/context/builder-provider";
import { Loader } from "lucide-react";
import BuilderDragOverlay from "./BuilderDragOverlay";

const FormBuilder = () => {
  const { formData, loading } = useBuilder();
  const isPublished = formData?.published;

  const [isSidebarOpen, setIsSidebarOpen] = useState(!isPublished);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const sensors = useSensors(mouseSensor);

  if (loading) {
    return (
      <div className="w-full flex h-56 items-center justify-center">
        <Loader className="animate-spin" size="3rem" />
      </div>
    );
  }

  return (
    <div>
      <DndContext sensors={sensors}>
        <BuilderDragOverlay />
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
          <Builder isSidebarOpen={isSidebarOpen} />
        </SidebarProvider>
      </DndContext>
    </div>
  );
};

export default FormBuilder;
