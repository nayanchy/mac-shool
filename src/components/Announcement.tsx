import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utility";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const today = new Date();

const Announcement = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.meta as { role?: string })?.role;
  console.log(userId);

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };
  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          {
            classId: null,
          },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  return (
    <div className="white-rounded">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Announcements</h1>
        <Link href="/">
          <span className="text-xs text-gray-300">View all</span>
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.length > 0 ? (
          data.map((announcementItem) => (
            <div
              key={announcementItem.id}
              className="odd:bg-macSkyLight even:bg-macYellowLight g-padding rounded-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">
                  {announcementItem.title}
                </h2>
                <span className="text-sm text-gray-400 bg-white rounded-full px-2 py-1">
                  {formatDate(announcementItem.date)}
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {announcementItem.description}
              </div>
            </div>
          ))
        ) : (
          <h1>No announcements</h1>
        )}
      </div>
    </div>
  );
};

export default Announcement;
