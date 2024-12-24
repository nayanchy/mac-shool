import prisma from "@/lib/prisma";
import Image from "next/image";
import React from "react";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  let data;
  const currentYear = new Date().getFullYear();
  const sessionYear = `${currentYear}/${(currentYear + 1)
    .toString()
    .slice(-2)}`;
  switch (type) {
    case "admin":
      data = await prisma.admin.count();
      break;
    case "teacher":
      data = await prisma.teacher.count();
      break;
    case "student":
      data = await prisma.student.count();
      break;
    case "parent":
      data = await prisma.parent.count();
      break;
    default:
      break;
  }
  return (
    <div className="p-4 rounded-2xl odd:bg-macPurple even:bg-macYellow flex-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-slate-100 rounded-full px-2 py-1 text-green-600">
          {sessionYear}
        </span>
        <Image src="/more.png" alt="more" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-gray-500 text-sm">{`${type}s`}</h2>
    </div>
  );
};

export default UserCard;
