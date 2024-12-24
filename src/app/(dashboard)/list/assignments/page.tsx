import FormModal from "@/components/FormModal";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type AssignmentsList = Assignment & {
  lesson: {
    class: Class;
    teacher: Teacher;
    subject: Subject;
  };
};

const AssignmentsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const { role, userId } = await getUserRole();
  console.log(searchParams);
  // URL Parameter Conditions
  const query: Prisma.AssignmentWhereInput = {};
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

  // Role Based Conditions
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
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            class: { select: { name: true } },
            teacher: { select: { name: true } },
            subject: { select: { name: true } },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.assignment.count({ where: query }),
  ]);
  const columns = [
    {
      header: "Subject",
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
    {
      header: "DueDate",
      accessor: "dueDate",
      className: "hidden lg:table-cell",
    },
    { header: "Actions", accessor: "actions" },
  ];
  const renderRow = (item: AssignmentsList) => {
    return (
      <tr
        key={item.id}
        className="border-b odd:bg-macSkyLight even:bg-white hover:bg-macPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.lesson.subject.name}</h3>
          </div>
        </td>
        <td className="hidden md:table-cell ">{item.lesson.class.name}</td>
        <td className="hidden md:table-cell ">{item.lesson.teacher.name}</td>
        <td className="hidden md:table-cell ">
          {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
        </td>

        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/assignments/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-macSky">
                <Image src="/view.png" alt="view" width={16} height={16} />
              </button>
            </Link>
            {(role === "admin" || role === "teacher") && (
              <>
                <FormModal
                  type="update"
                  table="assignment"
                  data={item}
                  id={item.id}
                />
                <FormModal type="delete" table="assignment" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            <FormModal type="create" table="assignment" />
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

export default AssignmentsListPage;
