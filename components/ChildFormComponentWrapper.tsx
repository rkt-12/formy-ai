import React from 'react'
import { FormBlockInstance } from "@/@types/form-block.type";
import { FormBlocks } from "@/lib/form-blocks";

const ChildFormComponentWrapper = ({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) => {
  const FormComponent = FormBlocks[blockInstance.blockType]?.formComponent;
  if (!FormComponent) return null;
  return <FormComponent blockInstance={blockInstance} />;
};

export default ChildFormComponentWrapper;
