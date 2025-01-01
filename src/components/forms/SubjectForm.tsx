"use client";

import { subjectFormSchema, SubjectSchema } from "@/lib/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomFormField from "./CustomFormField";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { createSubject, updateSubject } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Key, useState } from "react";
import { Checkbox } from "../ui/checkbox";

const SubjectForm = ({
  type,
  data,
  handleModal,
  relatedData,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  handleModal: () => void;
  relatedData?: any;
}) => {
  const options = relatedData.teachers;
  const { toast } = useToast();
  const router = useRouter();
  console.log(data);
  console.log(relatedData);

  const teacherIds = data?.teachers?.map(
    (teacher: { id: string }) => teacher.id
  );
  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      ...data,
      teachers: teacherIds,
    },
  });
  const [state, setState] = useState({
    success: false,
    error: false,
  });

  const onSubmit = async (values: SubjectSchema) => {
    try {
      const result =
        type === "create"
          ? await createSubject(state, values)
          : await updateSubject(state, values);
      setState(result);

      if (result.success) {
        toast({
          title:
            type === "create"
              ? "New Subject Created"
              : type === "update"
              ? "The subject is updated"
              : "",
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
            {type === "update" && (
              <div className="hidden">
                <CustomFormField
                  control={form.control}
                  name="id"
                  label="ID"
                  placeholder="ID"
                  defaultValue={data?.id}
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            {/* <CustomFormField
              control={form.control}
              type="checkbox"
              name="teachers"
              label="Teacher Name"
              placeholder="Teacher Name"
              options={relatedData.teachers}
              defaultValue={data?.teachers}
              table="subject"
            /> */}
            <FormField
              control={form.control}
              name="teachers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teachers</FormLabel>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                    {options.map(
                      (option: {
                        id: Key | null | undefined;
                        name: any;
                        surname: any;
                      }) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`teacher-${option.id}`}
                            checked={
                              field.value?.includes(String(option.id)) || false
                            }
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), String(option.id)]
                                : field.value?.filter(
                                    (id) => id !== String(option.id)
                                  ) || [];
                              field.onChange(updatedValue);
                            }}
                          />

                          <label htmlFor={`teacher-${option.id}`}>
                            {`${option.name} ${option.surname}`}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
