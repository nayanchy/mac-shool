"user client";

import {
  formSchema,
  studentCreateSchema,
  StudentCreateSchema,
  studentUpdateSchema,
  StudentUpdateSchema,
} from "@/lib/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import CustomFormField from "./CustomFormField";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "../ui/DatePicker";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { ImageIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createStudent, updateStudent } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const StudentForm = ({
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
  const router = useRouter();
  const [state, setState] = useState({
    success: false,
    error: false,
  });
  const [img, setImg] = useState<any>(data ? data.img : null);
  const { toast } = useToast();

  const subjectIds = data?.subjects?.map((subject: { id: number }) =>
    String(subject.id)
  );

  const classIds = data?.classes?.map((classItem: { id: number }) =>
    String(classItem.id)
  );
  const form = useForm<StudentCreateSchema | StudentUpdateSchema>({
    resolver: zodResolver(
      type === "create" ? studentCreateSchema : studentUpdateSchema
    ),
    defaultValues: {
      ...data,
      subjects: subjectIds,
      classes: classIds,
    },
  });

  const onSubmit = async (
    values: StudentCreateSchema | StudentUpdateSchema
  ) => {
    try {
      const formattedValues = {
        ...values,
        img: img ? img.secure_url : "",
      };
      const result =
        type === "create"
          ? createStudent(state, formattedValues)
          : updateStudent(state, formattedValues);
      setState(await result);

      toast({
        title:
          type === "create"
            ? "New Student has been created"
            : "Student has been updated",
      });
      router.refresh();
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

    handleModal();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-xl font-semibold text-center">
          {`${type === "create" ? "Create new" : "Update"} student`}
        </h1>

        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium text-center py-6">
            Authentication Information
          </span>
          <div className="flex flex-col md:flex-row gap-2 w-full ">
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                name="username"
                label="Username"
                placeholder="Username"
                defaultValue={data?.username}
              />
            </div>
            <div className="hidden">
              <CustomFormField
                control={form.control}
                name="id"
                label="ID"
                placeholder="ID"
                defaultValue={data?.id}
              />
            </div>
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                defaultValue={data?.email}
              />
            </div>
            {type === "create" && (
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  defaultValue={data?.password}
                />
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400 font-medium text-center py-6">
            Class, Grade and Parent Selection
          </span>
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
                  name="classId"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedData?.classes?.map(
                            (option: { id: number; name: string }) => (
                              <SelectItem
                                key={option.id}
                                value={option.id.toString()}
                              >
                                {option.name}
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
                  name="parentId"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Parent</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Parent" />
                        </SelectTrigger>
                        <SelectContent>
                          {relatedData?.parents?.map(
                            (option: {
                              id: number;
                              name: string;
                              surname: string;
                            }) => (
                              <SelectItem
                                key={option.id}
                                value={option.id.toString()}
                              >
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
          <span className="text-xs text-gray-400 font-medium text-center py-6">
            Personal Information
          </span>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="name"
                  label="First Name"
                  placeholder="First Name"
                  type="text"
                  defaultValue={data?.firstName}
                />
              </div>
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="surname"
                  label="Last Name"
                  placeholder="Last Name"
                  type="text"
                  defaultValue={data?.lastName}
                />
              </div>
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="phone"
                  label="Phone"
                  placeholder="Phone Number"
                  type="number"
                  defaultValue={data?.phone}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="Address"
                  type="text"
                  defaultValue={data?.address}
                />
              </div>
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="bloodgroup"
                  label="Blood Group"
                  placeholder="Blood Group"
                  type="text"
                  defaultValue={data?.bloodgroup}
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  name="birthday"
                  control={form.control}
                  label="Birthday"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="sex"
                  label="Sex"
                  placeholder="Sex"
                  type="select"
                  options={["MALE", "FEMALE"]}
                />
              </div>
              <div className="flex-1"></div>
              <div className="flex-1 self-end">
                {img && (
                  <Image
                    src={type === "create" ? img.secure_url : img}
                    alt="profile"
                    width={100}
                    height={100}
                    className="object-cover text-center"
                  />
                )}
                <CldUploadWidget
                  uploadPreset="schoolDashboard"
                  onSuccess={(result, widget) => {
                    setImg(result.info);
                    widget.close();
                  }}
                >
                  {({ open }) => {
                    return (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          open();
                        }}
                        className="w-full"
                      >
                        <ImageIcon /> Upload Profile Picture
                      </Button>
                    );
                  }}
                </CldUploadWidget>
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

export default StudentForm;
