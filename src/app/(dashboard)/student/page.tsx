import React from "react";
import EventCalendar from "@/components/EventCalendar";
import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import BigCalendarContainer from "@/components/containers/BigCalendarContainer";

const StudentPage = async () => {
  const { userId } = await auth();
  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
  });

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="h-full bg-white rounded-md">
          <h1 className="text-xl font-semibold g-padding">Schedule 4(A)</h1>
          <BigCalendarContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcement />
      </div>
    </div>
  );
};

export default StudentPage;
