import { ElementType, FC } from "react";

export type FormCategoryType="Layout"|"Field";
export type FormBlockType="RowLayout"|"RadioSelect"|"TextField"|"TextArea"|"StarRating"|"Heading"|"Paragraph";

export type ObjectBlockType={
    blockCategory:FormCategoryType;
    blockType:FormBlockType;

    createInstance:(id:string)=>FormBlockInstance;

    blockBtnElement:{
        icon: ElementType;
        label: string;
    };

    canvasComponent:FC<{blockInstance:FormBlockInstance}>;
    formComponent:FC<{blockInstance:FormBlockInstance}>;
    propertiesComponent:FC<{
        positionIndex?:number;
        parentId?:string;
        blockInstance:FormBlockInstance;
    }>;

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