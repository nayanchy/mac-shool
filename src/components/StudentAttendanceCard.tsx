import React from "react";
import InfoCards from "./InfoCards";
import prisma from "@/lib/prisma";

const StudentAttendanceCard = async ({ id }: { id: string }) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const totaDays = attendance.length;
  const presentDays = attendance.filter((day) => day.present).length;
  const percentage = totaDays ? (presentDays / totaDays) * 100 : 0;

  console.log(totaDays, presentDays, percentage);
  return (
    <InfoCards
      image="/singleAttendance.png"
      alt="attendance"
      title="Attendance"
      value={`${percentage}%`}
    />
  );
};

export default StudentAttendanceCard;
