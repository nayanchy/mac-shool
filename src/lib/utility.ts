import { z } from "zod";

export type dataType = {
  name: string;
  count: number;
  fill: string;
}[];

/**
 * Formats a given Date object into a string representation in the format "DD/MM/YYYY".
 *
 * @param date - The Date object to be formatted.
 * @returns A string representing the formatted date in "DD/MM/YYYY" format.
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(100, { message: "Username can be at most 100 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(1, { message: "Phone name is required" }),
  address: z.string().min(1, { message: "Address name is required" }),
  bloodGroup: z.string().min(1, { message: "Blood group is required" }),
  birthday: z.string({ message: "A date of birth is required." }),
  sex: z.enum(["male", "female"], { message: "Sex is required" }),
  // img: z
  //   .instanceof(File, { message: "Image is required" })
  //   .refine((file) => file && file.type.startsWith("image/"), {
  //     message: "A valid image file is required",
  //   })
  //   .nullable(), // Make img optional for now
});

export const teacherformSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(100, { message: "Username can be at most 100 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  name: z.string().min(1, { message: "First name is required" }).optional(),
  surname: z.string().min(1, { message: "Last name is required" }).optional(),
  phone: z.string().optional(),
  address: z.string(),
  bloodgroup: z.string().min(1, { message: "Blood group is required" }),
  birthday: z.string({ message: "A date of birth is required." }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img: z.string().optional(), // Make img optional for now
  subjects: z.array(z.string()),
  classes: z.array(z.string()),
});

export type TeacherSchema = z.infer<typeof teacherformSchema>;

export const subjectFormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectFormSchema>;

export const classFormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string({ required_error: "Subject name is required!" })
    .min(1, { message: "Subject name is required!" }),
  capacity: z.coerce
    .number({ required_error: "Capacity is required" })
    .min(1, { message: "The class capacity must be at least 1" }),
  gradeId: z.coerce
    .number({ required_error: "Grade is required" })
    .min(1, { message: "Enter a valid gradeId" }),
  supervisorId: z
    .string({ required_error: "Supervisor is required" })
    .min(1, { message: "Enter a valid supervisorId" })
    .optional(),
});

export type ClassSchema = z.infer<typeof classFormSchema>;
/**
 * Formats a given Date object into a string representation in the format "h:mm a".
 *
 * @param date - The Date object to be formatted.
 * @returns A string representing the formatted time in "h:mm a" format.
 */
export function formatHoursMinutes(date: Date) {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Gets the count and percentage of a given type from the given data.
 *
 * @param data - The data to be processed. It should be an array of objects with
 * "name" and "count" properties.
 * @param type - The type to be extracted from the data.
 * @returns An object with two properties: `singleCount` and `percentage`. `singleCount`
 * is the count of the given type, and `percentage` is the percentage of the given
 * type relative to the total count.
 */
export const getCount = (data: dataType, type: string) => {
  const total = data.find((item) => item.name === "Total")?.count;
  const singleCount = data.find((item) => item.name === type)?.count;
  let percentage = 0;

  if (typeof total === "number" && typeof singleCount === "number") {
    percentage = (singleCount / total) * 100;
  }

  return { singleCount, percentage };
};

/**
 * Gets the start and end dates of the current week.
 *
 * The start date is Monday of the current week, and the end date is Friday of the
 * current week. The dates are returned in the format of a Date object.
 *
 * @returns An object with two properties: `startOfWeek` and `endOfWeek`. `startOfWeek`
 * is the start date of the current week, and `endOfWeek` is the end date of the current
 * week.
 */
const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const startOfWeek = new Date(today);

  if (dayOfWeek === 0) {
    startOfWeek.setDate(today.getDate() + 1);
  }
  if (dayOfWeek === 6) {
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }

  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

/**
 * Adjusts a list of lessons to the current week.
 *
 * This function takes a list of lessons in the format of an array of objects with
 * `title`, `start`, and `end` properties. The `start` and `end` properties must be
 * Date objects. The function returns a new array of lessons where the `start` and
 * `end` dates have been adjusted to the current week.
 *
 * The function works by finding the start of the current week (Monday), and then
 * adjusting the `start` and `end` dates of each lesson to the corresponding day of
 * the week. The time of day is preserved, but the date is changed.
 *
 * @param lessons The list of lessons to adjust.
 * @returns The adjusted list of lessons.
 */
export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const { startOfWeek } = currentWorkWeek();
  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;
    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
      lesson.start.getMilliseconds()
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
      lesson.end.getMilliseconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
