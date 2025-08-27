import { ElementType, FC } from "react";

export type FormCategoryType="Layout"|"Field";
export type FormBlockType="RowLayout"

export type ObjectBlockType={
    blockCategory:FormCategoryType;
    blockType:FormBlockType;

    createInstance:(id:string)=>FormBlockInstance;

    blockBtnElement:{
        icon: ElementType;
        label: string;
    };

    canvasComponent:FC;
    formComponent:FC;
    propertiesComponent:FC;

};

export type FormBlockInstance={
    id:string;
    blockType:FormBlockType;
    attributes?:Record<string,any>;
    isLocked?:boolean;
    childBlocks?:FormBlockInstance[];
};

export type FormBlocksType={
    [key in FormBlockType]:ObjectBlockType
}