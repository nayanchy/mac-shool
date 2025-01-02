import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import InfoCards from "@/components/InfoCards";
import Performance from "@/components/Performance";
import UserInfoCard from "@/components/UserInfoCard";
import prisma from "@/lib/prisma";
import { TeacherData } from "@/lib/types";
import Link from "next/link";
import React from "react";

const SingleTeacherPage = async ({ params }: { params: { id: string } }) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: params.id,
    },
    include: {
      subjects: true,
      classes: true,
    },
  });
  console.log(teacher);
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* Top */}
        <div className="flex flex-col lg:flex-row gap-4">
          <UserInfoCard data={teacher as TeacherData} />
          {/* <FormModal type="update" table="teacher" data={teacher} /> */}
          {/* Small Cards */}
          <div className="flex-1 flex flex-wrap gap-4 justify-between ">
            <InfoCards
              image="/singleAttendance.png"
              alt="attendance"
              title="Attendance"
              value="50%"
            />
            <InfoCards
              image="/singleBranch.png"
              alt="branches"
              title="Branches"
              value="2"
            />
            <InfoCards
              image="/singleLesson.png"
              alt="lesson"
              title="Lessons"
              value="21"
            />
            <InfoCards
              image="/singleClass.png"
              alt="Class"
              title="Class"
              value="5"
            />
          </div>
        </div>
        {/* Bottom */}
        <div className="white-rounded h-[800px]">
          <h1 className="text-xl font-semibold">Teacher&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="white-rounded">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              href={`/list/classes?supervisorId=${"teacher2"}`}
              className="p-3 rounded-md bg-macSkyLight"
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              href={`/list/students?teacherId=${"teacher2"}`}
              className="p-3 rounded-md bg-macPurpleLight"
            >
              Teacher&apos;s Students
            </Link>
            <Link
              href={`/list/exams?teacherId=${"teacher2"}`}
              className="p-3 rounded-md bg-macYellowLight"
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?teacherId=${"teacher2"}`}
              className="p-3 rounded-md bg-pink-50"
            >
              Teacher&apos;s Assignments
            </Link>
            <Link
              href={`/list/lessons?teacherId=${"teacher2"}`}
              className="p-3 rounded-md bg-macSkyLight"
            >
              Teacher&apos;s Lessons
            </Link>
          </div>
        </div>
        <Performance />
        <Announcement />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
