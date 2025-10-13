"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { defaultBackgroundColor } from "@/constant";
import { useBuilder } from "@/context/builder-provider";
import { FormBlocks } from "@/lib/form-blocks";

const PreviewDialog = () => {
  const { blockLayouts } = useBuilder();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="!h-8 !text-primary !bg-primary/10 !border-primary"
        >
          <Eye />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col flex-grow max-h-svh h-full p-0 gap-0 w-screen max-w-full ">
        <DialogHeader className="pt-4 px-4 pb-4 shadow-sm bg-white">
          <DialogTitle>Preview Mode</DialogTitle>
        </DialogHeader>
        <div
          className="w-full h-full overflow-y-auto scrollbar transition-all duration-300"
          style={{ backgroundColor: defaultBackgroundColor }}
        >
          <div className="w-full h-full max-w-[650px] mx-auto">
            <div className="w-full relative bg-transparent px-2 flex flex-col items-center justify-start pt-1 pb-14">
              <div className="w-full mb-3 bg-white bg-[url(/images/form-bg.jpg)]" />
              {blockLayouts.length>0 && (
                <div className="flex flex-col w-full gap-4">
                    {blockLayouts.map((block) => {
                        const FormBlockComponent = FormBlocks[block.blockType]?.formComponent;
                        return (
                            <FormBlockComponent key={block.id} blockInstance={block}/>
                        )
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
