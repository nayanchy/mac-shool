"use client";

import * as React from "react";
import { format, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Control, FieldValues, Path } from "react-hook-form";

type CustomFormFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>; // Ensures the name matches the schema keys
  label: string; // Optional to make it more versatile
  control: Control<TFieldValues, any>;
};

export function DatePicker({ control, name, label }) {
  //   const [date, setDate] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState(false);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const startingYear = new Date().getFullYear() - 100;
  const endingYear = new Date().getFullYear() + 100;
  const arrLength = endingYear - startingYear + 1;
  const years = Array.from(
    { length: arrLength },
    (_, index) => startingYear + index
  );
  //   const handleMonthChange = (value: string) => {
  //     const newDate = setMonth(date, months.indexOf(value));
  //     setDate(newDate);
  //   };

  //   const handleYearChange = (value: number) => {
  //     const newYear = setYear(date, value);
  //     setDate(newYear);
  //   };
  const normalizeDate = (date: Date): Date => {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const date = field.value ? new Date(field.value) : new Date();
        const handleMonthChange = (value: string) => {
          const newDate = setMonth(date, months.indexOf(value));
          field.onChange(normalizeDate(newDate).toISOString());
        };

        const handleYearChange = (value: number) => {
          const newYear = setYear(date, value);
          field.onChange(normalizeDate(newYear).toISOString());
        };
        const handleDateChange = (selectedDate: Date | undefined) => {
          if (selectedDate) {
            field.onChange(normalizeDate(selectedDate).toISOString());
            setOpen(false);
          }
        };
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex gap-2 p-4 justify-between items-center">
                  <Select
                    onValueChange={handleMonthChange}
                    value={months[date.getMonth()]}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={handleYearChange}
                    value={getYear(date).toString()}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                  month={date}
                  year={date}
                  onMonthChange={handleDateChange}
                />
              </PopoverContent>
            </Popover>
            <FormMessage></FormMessage>
          </FormItem>
        );
      }}
    />
  );
}
