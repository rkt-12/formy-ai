"use client";
import { FormBlockInstance } from "@/@types/form-block.type";
import { FormWithSettings } from "@/@types/form.type";
import { useParams } from "next/navigation";
import React, { createContext, use, useEffect } from "react";

type BuilderContextType = {
    loading: boolean;
    formData: FormWithSettings | null ;
    setFormData: React.Dispatch<React.SetStateAction<FormWithSettings | null>>;

    blocks: FormBlockInstance[];
    setBlocks: React.Dispatch<React.SetStateAction<FormBlockInstance[]>>;
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
    const [blocks, setBlocks] = React.useState<FormBlockInstance[]>([]);

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
                        setBlocks(parsedBlocks);
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

    return (
        <BuilderContext.Provider value={{
            loading,
            formData,
            setFormData,
            blocks,
            setBlocks
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