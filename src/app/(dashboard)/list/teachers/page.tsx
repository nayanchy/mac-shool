import FormContainer from "@/components/forms/FormContainer";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...queryParams } = searchParams ?? {};

  const p = page ? parseInt(page) : 1;

  const { role } = await getUserRole();

  // URL Parameter Conditions
  const query: Prisma.TeacherWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            {
              query.name = { contains: value, mode: "insensitive" };
            }
            break;
          default:
            break;
        }
      }
    }
  }

  const [teachers, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.teacher.count({
      where: query,
    }),
  ]);
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Teacher Id",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Classes",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" ? [{ header: "Actions", accessor: "actions" }] : []),
  ];

  const renderRow = (item: TeacherList) => {
    return (
      <tr
        key={item.id}
        className="border-b odd:bg-macSkyLight even:bg-white hover:bg-macPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item.img || "/noAvatar.png"}
            alt="teacher"
            width={40}
            height={40}
            className="rounded-full md:hidden xl:block w-10 h-10 object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-500">{item?.email}</p>
          </div>
        </td>
        <td className="hidden md:table-cell ">{item.username}</td>
        <td className="hidden md:table-cell ">
          {item.subjects.map((subject) => subject.name).join(", ")}
        </td>
        <td className="hidden md:table-cell ">
          {item.classes.map((cls) => cls.name).join(", ")}
        </td>
        <td className="hidden md:table-cell ">{item.phone}</td>
        <td className="hidden md:table-cell ">{item.address}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/teachers/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-macSky">
                <Image src="/view.png" alt="view" width={16} height={16} />
              </button>
            </Link>
            {role === "admin" && (
              <FormContainer type="delete" table="teacher" id={item.id} />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="white-rounded m-4 mt-0 flex-1">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            {role === "admin" && (
              <>
                <FormContainer type="create" table="teacher" />
              </>
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <div className="">
        <Table columns={columns} row={renderRow} data={teachers} />
      </div>
      {/* Pagination */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;
