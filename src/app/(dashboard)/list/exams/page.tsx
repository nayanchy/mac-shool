import FormModal from "@/components/FormModal";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import React from "react";

type ExamsList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const ExamsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.ExamWhereInput = {};
  const { role, userId } = await getUserRole();

  query.lesson = {};

  // URL Parameter Conditions
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "search":
            query.lesson.subject = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // Role based conditions
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = userId!;
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: userId,
          },
        },
      };
      break;
    case "parent":
      query.lesson.class = {
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
  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Subject",
      accessor: "subject",
    },
    {
      header: "class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    (role === "admin" || role === "teacher") && {
      header: "Actions",
      accessor: "actions",
    },
  ];
  const renderRow = (item: ExamsList) => {
    return (
      <tr
        key={item.id}
        className="border-b odd:bg-macSkyLight even:bg-white hover:bg-macPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.lesson?.subject.name}</h3>
          </div>
        </td>
        <td className="hidden md:table-cell ">{item.lesson?.class.name}</td>
        <td className="hidden md:table-cell ">
          {`${item.lesson.teacher.name} ${item.lesson?.teacher?.surname}`}
        </td>
        <td className="hidden md:table-cell ">
          {new Intl.DateTimeFormat("en-US").format(item.startTime)}
        </td>
        {role === "admin" ||
          (role === "teacher" && (
            <td>
              <div className="flex items-center gap-2">
                <>
                  <FormModal
                    type="update"
                    table="exam"
                    data={item}
                    id={item.id}
                  />
                  <FormModal type="delete" table="exam" id={item.id} />
                </>
              </div>
            </td>
          ))}
      </tr>
    );
  };
  return (
    <div className="white-rounded m-4 mt-0 flex-1">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            {(role === "admin" || role === "teacher") && (
              <FormModal type="create" table="exam" />
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <div className="">
        <Table columns={columns} row={renderRow} data={data} />
      </div>
      {/* Pagination */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ExamsListPage;
