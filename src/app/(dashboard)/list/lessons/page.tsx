import FormModal from "@/components/FormModal";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type LessonList = Lesson & { class: Class } & { teacher: Teacher } & {
  subject: Subject;
};

const LessonsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const { role, userId } = await getUserRole();

  // URL Parameter Conditions
  const query: Prisma.LessonWhereInput = {};
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.teacherId = value;
            break;
          case "classId":
            query.classId = parseInt(value);
            break;
          case "search":
            query.OR = [
              {
                subject: {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              },
              {
                teacher: {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              },
            ];
            break;

          default:
            break;
        }
      }
    });
  }

  // Role based conditions
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.teacherId = userId;
      break;
    case "student":
      query.class = {
        students: {
          some: {
            id: userId,
          },
        },
      };
      break;
    case "parent":
      query.class = {
        students: {
          some: {
            parentId: userId,
          },
        },
      };
      break;
    default:
      break;
  }
  const [lessonData, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        class: { select: { name: true } },
        teacher: { select: { name: true } },
        subject: { select: { name: true } },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Name",
      accessor: "subject",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    { header: "Actions", accessor: "actions" },
  ];
  const renderRow = (item: LessonList) => {
    return (
      <tr
        key={item.id}
        className="border-b odd:bg-macSkyLight even:bg-white hover:bg-macPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.subject.name}</h3>
          </div>
        </td>
        <td className="hidden md:table-cell ">{item.class.name}</td>
        <td className="hidden md:table-cell ">{item.teacher.name}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/lessons/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-macSky">
                <Image src="/view.png" alt="view" width={16} height={16} />
              </button>
            </Link>
            {role === "admin" && (
              <>
                <FormModal
                  type="update"
                  table="lesson"
                  data={item}
                  id={item.id}
                />
                <FormModal type="delete" table="lesson" id={item.id} />
              </>
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
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            <FormModal type="create" table="lesson" />
          </div>
        </div>
      </div>
      {/* List */}
      <div className="">
        <Table columns={columns} row={renderRow} data={lessonData} />
      </div>
      {/* Pagination */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default LessonsListPage;
