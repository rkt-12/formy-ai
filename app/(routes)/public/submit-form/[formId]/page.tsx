import { fetchPublishFormById } from "@/actions/form.action";
import React from "react";
import NotAvailable from "../../_components/NotAvailable";
import { FormBlockInstance } from "@/@types/form-block.type";
import FormSubmitComponent from "../../_components/FormSubmitComponent";

const Page = async ({ params }: { params: { formId: string } }) => {
  const { formId } = params;
  const { form } = await fetchPublishFormById(formId);

  if (!form) {
    return <NotAvailable />;
  }
  const blocks = JSON.parse(form.jsonBlocks) as FormBlockInstance[];

  return (
    <FormSubmitComponent formId={formId} blocks={blocks}/>
  )
};

export default Page;
