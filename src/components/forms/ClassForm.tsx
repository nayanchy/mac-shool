"use client";

import { classFormSchema, ClassSchema } from "@/lib/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomFormField from "./CustomFormField";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  createClass,
  createSubject,
  updateClass,
  updateSubject,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Key, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ClassForm = ({
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
  //   const options = relatedData.teachers;
  console.log("relatedData in ClassForm:", relatedData);
  const { toast } = useToast();
  const router = useRouter();
  console.log(data);
  console.log(relatedData);
  const form = useForm<ClassSchema>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      ...data,
    },
  });
  const [state, setState] = useState({
    success: false,
    error: false,
  });

  const onSubmit = async (values: ClassSchema) => {
    try {
      const result =
        type === "create"
          ? await createClass(state, values)
          : await updateClass(state, values);
      setState(result);

      if (result.success) {
        toast({
          title:
            type === "create"
              ? "New Class Created"
              : type === "update"
              ? "The class is updated"
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
          {`${type === "create" ? "Create new class" : "Update the class"}`}
        </h1>

        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row gap-2 w-full ">
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                name="name"
                label="Class Name"
                placeholder="Class Name"
                defaultValue={data?.name}
              />
            </div>
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                type="number"
                name="capacity"
                label="Capacity"
                placeholder="capacity"
                defaultValue={data?.capacity}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {relatedData?.grades?.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {/* {option[0].toUpperCase() + option.slice(1)} */}
                            {option.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
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
            {/* <FormField
              control={form.control}
              name="teachers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teachers</FormLabel>
                  <div className="space-y-2">
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
            /> */}
          </div>
        </div>

        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ClassForm;
