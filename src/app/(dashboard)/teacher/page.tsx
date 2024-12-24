import React from "react";
import EventCalendar from "@/components/EventCalendar";
import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import BigCalendarContainer from "@/components/containers/BigCalendarContainer";
import { auth } from "@clerk/nextjs/server";

const TeacherPage = async () => {
  const { userId } = await auth();
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="h-full bg-white rounded-md">
          <h1 className="text-xl font-semibold g-padding">Schedule 4(A)</h1>
          <BigCalendarContainer type="teacherId" id={userId!} />
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

export default TeacherPage;
