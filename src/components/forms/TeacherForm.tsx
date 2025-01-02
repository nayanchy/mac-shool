"user client";

import {
  teacherCreateSchema,
  TeacherCreateSchema,
  TeacherUpdateSchema,
  teacherUpdateSchema,
} from "@/lib/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomFormField from "./CustomFormField";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "../ui/DatePicker";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
const TeacherForm = ({
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
  const parsedBirthday = data?.birthday ? new Date(data.birthday) : null;

  const subjectIds = data?.subjects?.map((subject: { id: number }) =>
    String(subject.id)
  );

  const classIds = data?.classes?.map((classItem: { id: number }) =>
    String(classItem.id)
  );
  const form = useForm<TeacherCreateSchema | TeacherUpdateSchema>({
    resolver: zodResolver(
      type === "create" ? teacherCreateSchema : teacherUpdateSchema
    ),
    defaultValues: {
      ...data,
      subjects: subjectIds,
      classes: classIds,
    },
  });

  const onSubmit = async (
    values: TeacherCreateSchema | TeacherUpdateSchema
  ) => {
    try {
      const formattedSubjects = values.subjects?.map((id) => parseInt(id, 10));
      const formattedClasses = values.classes?.map((id) => parseInt(id, 10));

      const formattedValues = {
        ...values,
        img: img.secure_url,
        subjects: formattedSubjects,
        classes: formattedClasses,
      };
      const result =
        type === "create"
          ? createTeacher(state, formattedValues)
          : updateTeacher(state, formattedValues);
      setState(await result);

      toast({
        title:
          type === "create"
            ? "New Teacher has been created"
            : "Teacher has been updated",
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
          {`${type === "create" ? "Create new" : "Update"} teacher`}
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
            Subject and Class Selection
          </span>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Subjects to the teacher</FormLabel>
                    <div className="grid grid-cols-4 gap-y-2 gap-x-4">
                      {relatedData?.subjects.map(
                        (option: { id: number; name: string }) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`subject-${option.id}`}
                              checked={
                                field.value?.includes(String(option.id)) ||
                                false
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

                            <label htmlFor={`subject-${option.id}`}>
                              {option.name}
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
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name="classes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Classes to the teacher</FormLabel>
                    <div className="grid grid-cols-4 gap-y-2 gap-x-4">
                      {relatedData?.classes.map(
                        (option: { id: number; name: string }) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`classes-${option.id}`}
                              checked={
                                field.value?.includes(String(option.id)) ||
                                false
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

                            <label htmlFor={`subject-${option.id}`}>
                              {option.name}
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
                    src={type === "create" ? img.thumbnail_url : img}
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
                      <Button onClick={() => open()} className="w-full">
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

export default TeacherForm;
