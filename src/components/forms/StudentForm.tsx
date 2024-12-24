"user client";

import { formSchema } from "@/lib/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import CustomFormField from "./CustomFormField";
import { Form } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "../ui/DatePicker";

const StudentForm = ({
  type,
  data,
  handleModal,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  handleModal: () => void;
}) => {
  const { toast } = useToast();
  const parsedBirthday = data?.birthday ? new Date(data.birthday) : null;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      birthday: parsedBirthday,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast({
      title: "New Student has been created",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });

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
          </div>
          <span className="text-xs text-gray-400 font-medium text-center py-6">
            Personal Information
          </span>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="First Name"
                  type="text"
                  defaultValue={data?.firstName}
                />
              </div>
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="lastName"
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
                  name="bloodGroup"
                  label="Blood Group"
                  placeholder="Blood Group"
                  type="text"
                  defaultValue={data?.bloodGroup}
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
                  options={["male", "female"]}
                />
              </div>
              <div className="flex-1"></div>
              <div className="flex-1">
                <CustomFormField
                  control={form.control}
                  name="img"
                  label="Profile Picture"
                  placeholder="Profile Picture"
                  type="file"
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

export default StudentForm;
