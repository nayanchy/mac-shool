import React from "react";
import AttendanceChart from "../AttendanceChart";
import Image from "next/image";
import prisma from "@/lib/prisma";

/**
 * AttendanceChartContainer is a React component that fetches attendance data
 * from a Prisma database for the current week starting from Monday. It computes
 * the total present and absent counts for each weekday and renders an attendance
 * chart using the AttendanceChart component.
 *
 * The component queries the database to get attendance records from the start
 * of the current week and maps the retrieved data to a format suitable for
 * rendering in a chart. It displays the attendance chart in a styled container.
 *
 * @returns A JSX element containing the attendance chart and container.
 */
const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daySinceFirstWorkingDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daySinceFirstWorkingDay);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startOfWeek,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);

    const dayName = daysOfWeek[itemDate.getDay() - 1];
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));
  return (
    <div className=" bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      <div className="relative w-full h-[90%]">
        <AttendanceChart data={data} />
      </div>
    </div>
  );
};

export default AttendanceChartContainer;
