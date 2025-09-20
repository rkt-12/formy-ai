import { FormBlocksType } from "@/@types/form-block.type";
import { RadioSelectBlock } from "@/components/blocks/layouts/RadioSelectBlock";
import { RowLayoutBlock } from "@/components/blocks/layouts/RowLayout";
import { TextFieldBlock } from "@/components/blocks/TextField";

export const FormBlocks :FormBlocksType={
    RowLayout : RowLayoutBlock,
    TextField: TextFieldBlock,
    RadioSelect: RadioSelectBlock,
} 