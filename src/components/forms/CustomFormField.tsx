"use client";
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Control, FieldValues, Path } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
type OptionSubjectForm = {
  id: string | number;
  name: string;
  surname: string;
};
type CustomFormFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>; // Ensures the name matches the schema keys
  label: string;
  placeholder: string;
  type?: string; // Optional to make it more versatile
  control: Control<TFieldValues, any>;
  options?: any[] | OptionSubjectForm[];
  defaultValue?: string;
  hidden?: boolean;
  table?: string;
};

const CustomFormField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  options, // Default type is "text"
  defaultValue,
  hidden,
  table,
}: CustomFormFieldProps<TFieldValues>) => {
  if (
    type === "text" ||
    type === "number" ||
    type === "email" ||
    type === "password" ||
    type === "file"
  ) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem hidden={hidden}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                placeholder={placeholder}
                type={type}
                {...field}
                defaultValue={defaultValue}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  if (type === "select") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {table === "subject" &&
                  options?.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {/* {option[0].toUpperCase() + option.slice(1)} */}
                      {`${option.name} ${option.surname}`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (type == "checkbox") {
    return (
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>{label}</FormLabel>
            </div>
            {options?.map((option) => (
              <FormField
                key={option.id}
                control={control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== option.id
                                  )
                                ); // Update the field with the selected options</FormControl>)
                          }}
                        ></Checkbox>
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.name}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // if (type === "file") {
  //   return (
  //     <FormField
  //       control={control}
  //       name={name}
  //       render={({ field }) => (
  //         <FormItem>
  //           <FormLabel>{label}</FormLabel>
  //           <FormControl>
  //             <input
  //               type="file"
  //               {...field}
  //               onChange={(e) => {
  //                 const file = e.target.files ? e.target.files[0] : null;
  //                 field.onChange(file); // Update the field with the selected file
  //               }}
  //             />
  //           </FormControl>
  //           <FormMessage />
  //         </FormItem>
  //       )}
  //     />
  //   );
  // }

  if (type === "date") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              Your date of birth is used to calculate your age.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
};

export default CustomFormField;
