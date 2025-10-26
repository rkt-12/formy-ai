import { FormBlockInstance } from "@/@types/form-block.type";
import React from "react";

const FormSubmitComponent = (props: {
  formId: string;
  blocks: FormBlockInstance[];
}) => {
  const { formId, blocks } = props;
  return <div>FormSubmitComponent</div>;
};

export default FormSubmitComponent;
