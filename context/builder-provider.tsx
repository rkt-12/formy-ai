"use client";
import { FormBlockInstance } from "@/@types/form-block.type";
import { FormWithSettings } from "@/@types/form.type";
import { generateUniqueId } from "@/lib/helper";
import { set } from "date-fns";
import { useParams } from "next/navigation";
import React, { createContext, use, useEffect, useState } from "react";

type BuilderContextType = {
    loading: boolean;
    formData: FormWithSettings | null ;
    setFormData: React.Dispatch<React.SetStateAction<FormWithSettings | null>>;

    blockLayouts: FormBlockInstance[];
    setBlockLayouts: React.Dispatch<React.SetStateAction<FormBlockInstance[]>>;
    addBlockLayout:(blockLayout:FormBlockInstance)=>void;

    removeBlockLayout:(id:string)=>void;
    duplicateBlockLayout:(id:string)=>void;

    selectedBlockLayout : FormBlockInstance | null;
    handleSelectedLayout : (blockLayout: FormBlockInstance | null)=>void;
    repositionBlockLayout:(activeId:string, overId:string, position:"above" | "below")=>void;

    insertBlockLayoutAtIndex:(newblockLayout:FormBlockInstance, overId:string, position:"above" | "below")=>void;

    updateBlockLayout:(id:string, childrenBlocks:FormBlockInstance[])=>void;
};  

export const BuilderContext = createContext<BuilderContextType | null>(null);

export default function BuilderContextProvider({
    children
}:{
    children: React.ReactNode;
}) {
    const params = useParams();
    const formId = params.formId as string;

    const [loading, setLoading] = React.useState(true);
    const [formData, setFormData] = React.useState<FormWithSettings | null>(null);
    const [blockLayouts, setBlockLayouts] = React.useState<FormBlockInstance[]>([]);
    const [selectedBlockLayout,setSelectedBlockLayout]= useState<FormBlockInstance | null >(null); 

    useEffect(() => {
        const fetchData = async () => {
            
            try {
                setLoading(true);
                if (!formId) return;
                const response = await fetch(`/api/fetchFormById?formId=${formId}`,{method:'GET'} );
                if(!response.ok){
                    throw new Error("Failed to fetch form data");
                }
                
                const {data} = await response.json();
                const {form} = data;
                if (form) {
                    console.log(form,"form from useEffect");
                    setFormData(form);

                    if(form.jsonBllocks){
                        const parsedBlocks=JSON.parse(form.jsonBlocks);
                        setBlockLayouts(parsedBlocks);
                    }
                }
            } catch (error) {
                console.log("Error fetching form data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [formId]);

    const addBlockLayout = (blockLayout:FormBlockInstance)=>{
        setBlockLayouts((prev) => {
            const updatedBlock=[...prev];
            updatedBlock.push(blockLayout);
            return updatedBlock;
        })
    }

    const duplicateBlockLayout=(id:string)=>{
        setBlockLayouts((prevBlocks)=>{
            const blockToDuplicate=prevBlocks.find((block)=>block.id===id)
            if(!blockToDuplicate)return prevBlocks;

            const duplicatedBlocks={
                ...blockToDuplicate,
                id: `layout-${generateUniqueId()}`,
                childblocks: blockToDuplicate.childBlocks?.map((childblock)=>({
                    ...childblock,
                    id:generateUniqueId(),
                })),
            }

            const updatedBlockLayouts=[...prevBlocks]
            const insertIndex=prevBlocks.findIndex((block)=>block.id===id)+1
            updatedBlockLayouts.splice(insertIndex,0,duplicatedBlocks)

            return updatedBlockLayouts;
        })
    }

    const removeBlockLayout=(id:string)=>{
        setBlockLayouts((prev)=>prev.filter((block)=>block.id!==id))
        if(selectedBlockLayout?.id===id)setSelectedBlockLayout(null);
    }

    const handleSelectedLayout=(blockLayout:FormBlockInstance|null)=>{
        setSelectedBlockLayout(blockLayout);
    }

    const repositionBlockLayout=(activeId:string, overId:string, position:"above" | "below")=>{
        setBlockLayouts((prev)=>{
            const activeIndex= prev.findIndex((block)=>block.id===activeId);
            const overIndex= prev.findIndex((block)=>block.id===overId);
            if(activeIndex===-1 || overIndex===-1 ){
                console.warn("active or over block not found")
                return prev;
            }
            const updatedBlocks=[...prev];
            const [movedBlock]=updatedBlocks.splice(activeIndex,1);
            const insertIndex= position==="above" ? overIndex : overIndex +1;
            updatedBlocks.splice(insertIndex,0,movedBlock);
            return updatedBlocks;
        });
    }
    
    const insertBlockLayoutAtIndex=(newblockLayout:FormBlockInstance, overId:string, position:"above" | "below")=>{
        setBlockLayouts((prev)=>{
            const overIndex= prev.findIndex((block)=>block.id===overId);
            if(overIndex===-1 )return prev;

            const updatedBlocks=[...prev];
            const insertIndex= position==="above" ? overIndex : overIndex +1;
            updatedBlocks.splice(insertIndex,0,newblockLayout);
            return updatedBlocks;
        })
    }

    const updateBlockLayout=(id:string,childrenBlocks:FormBlockInstance[])=>{
        setBlockLayouts((prev)=>prev.map((block)=>
            block.id===id?{
                ...block,
                childBlocks:childrenBlocks,
            }:
            block
        ))
    }


    return (
        <BuilderContext.Provider value={{
            loading,
            formData,
            setFormData,
            blockLayouts,
            setBlockLayouts,
            addBlockLayout,
            removeBlockLayout,
            duplicateBlockLayout,
            selectedBlockLayout,
            handleSelectedLayout,
            repositionBlockLayout,
            insertBlockLayoutAtIndex,
            updateBlockLayout,
        }}>
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const context = React.useContext(BuilderContext);
    if (!context) {
        throw new Error("useBuilder must be used within a BuilderContextProvider");
    }
    return context;  
}