"use client";

import { classFormSchema, ClassSchema } from "@/lib/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomFormField from "./CustomFormField";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { createClass, updateClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  console.log(data);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ClassSchema>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      ...data,
    },
    mode: "all",
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
      form.setError("root", {
        type: "server",
        message: "An unexpected error occurred",
      });
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
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="gradeId"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedData?.grades?.map(
                            (option: { id: number; level: number }) => (
                              <SelectItem
                                key={option.id}
                                value={option.id.toString()}
                              >
                                {option.level}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="supervisorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedData?.teachers?.map(
                            (option: {
                              id: string;
                              name: string;
                              surname: string;
                            }) => (
                              <SelectItem key={option.id} value={option.id}>
                                {`${option.name} ${option.surname}`}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default ClassForm;
