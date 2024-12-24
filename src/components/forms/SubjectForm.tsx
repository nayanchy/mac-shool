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
import { useEffect } from "react";

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
  const [state, formAction] = useFormState(createSubject, {
    success: false,
    error: false,
  });
  const parsedBirthday = data?.birthday ? new Date(data.birthday) : null;
  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      ...data,
      birthday: parsedBirthday,
    },
  });

  const onSubmit = (values: SubjectSchema) => {
    toast({
      title: "New Subject Created",
    });
    formAction(values);
    router.refresh();
    handleModal();
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

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
