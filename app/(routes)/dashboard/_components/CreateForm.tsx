"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createForm } from "@/actions/form.action";
import { Toast } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const CreateForm = () => {

  const router=useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be atleast 2 chareacters",
    }),
    description: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await createForm({
      name: values.name,
      description: values.description,
    });
    if (response.success) {
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      router.push(`/dashboard/form/builder/${response.form?.formId}`)
    } else {
      toast({
        title: "Error",
        description: response?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="gap-1 !bg-primary !font-medium">
            <PlusIcon />
            Create a form
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <div className="w-full max-w-5xl mx-auto">
            <SheetHeader>
              <SheetTitle>Create New Form</SheetTitle>
              <SheetDescription>
                This will create a new form. Ensure all details are accurate.
              </SheetDescription>
            </SheetHeader>
            <div className="w-full dialog-content">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="Form Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Form Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="px-5 flex place-self-end !bg-primary"
                  >
                    {form.formState.isSubmitting && (
                      <Loader className="w-4 h-4 animate-spin" />
                    )}
                    Create
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateForm;
