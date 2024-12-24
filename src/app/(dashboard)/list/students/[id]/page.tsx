import Announcement from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import InfoCards from "@/components/InfoCards";
import Performance from "@/components/Performance";
import UserInfoCard from "@/components/UserInfoCard";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SingleStudentPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* Left */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* Top */}
        <div className="flex flex-col lg:flex-row gap-4">
          <UserInfoCard />
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
              alt="Grade"
              title="Grade"
              value="6th"
            />
            <InfoCards
              image="/singleLesson.png"
              alt="lesson"
              title="Lessons"
              value="21"
            />
            <InfoCards
              image="/singleClass.png"
              alt="Class Name"
              title="Class Name"
              value="6A"
            />
          </div>
        </div>
        {/* Bottom */}
        <div className="white-rounded h-[800px]">
          <h1 className="text-xl font-semibold">Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="white-rounded">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              href={`/list/teachers?studentId=${1}`}
              className="p-3 rounded-md bg-macPurpleLight"
            >
              Student&apos;s Teachers
            </Link>
            <Link
              href={`/list/exams?classId=${2}`}
              className="p-3 rounded-md bg-macYellowLight"
            >
              Student&apos;s Exams
            </Link>
            <Link
              href={`/list/assignments?classId=${2}`}
              className="p-3 rounded-md bg-pink-50"
            >
              Student&apos;s Assignments
            </Link>
            <Link
              href={`/list/lessons?classId=${2}`}
              className="p-3 rounded-md bg-macSkyLight"
            >
              Student&apos;s Lessons
            </Link>
            <Link
              href={`/list/results?studentId=${"student1"}`}
              className="p-3 rounded-md bg-macPurpleLight"
            >
              Student&apos;s Result
            </Link>
          </div>
        </div>
        <Performance />
        <Announcement />
      </div>
    </div>
  );
};

export default SingleStudentPage;
