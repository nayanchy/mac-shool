"use client";

import { subjectFormSchema, SubjectSchema } from "@/lib/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomFormField from "./CustomFormField";
import { Form } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { createSubject } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

const SubjectForm = ({
  type,
  data,
  handleModal,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  handleModal: () => void;
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      ...data,
    },
  });
  const [state, setState] = useState({
    success: false,
    error: false,
  });

  const onSubmit = async (values: SubjectSchema) => {
    try {
      const result = await createSubject(state, values);
      setState(result);

      if (result.success) {
        toast({
          title: "New Subject Created",
        });
        handleModal();
        router.refresh();
      }

      if (result.error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-xl font-semibold text-center">
          {`${type === "create" ? "Create new subject" : "Update the subject"}`}
        </h1>

        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row gap-2 w-full ">
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                name="name"
                label="Subject Name"
                placeholder="Subject Name"
                defaultValue={data?.name}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SubjectForm;
