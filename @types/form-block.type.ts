import { ElementType, FC } from "react";

export type FormCategoryType="Layout"|"Form";
export type FormBlockType="RowLayout"

export type FormBlock={
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
    [key in FormBlockType]:FormBlock
}