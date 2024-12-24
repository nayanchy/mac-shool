import FormModal from "@/components/FormModal";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import React from "react";

type ResultsList = {
  id: number;
  title: string;
  score: number;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  classname: string;
  startTime: Date;
};

const ResultsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const { role, userId } = await getUserRole();
  const query: Prisma.ResultWhereInput = {};

  // URL Parameter Conditions
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              {
                assignment: { title: { contains: value, mode: "insensitive" } },
              },
              { student: { name: { contains: value, mode: "insensitive" } } },
            ];
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
    case "student":
      query.studentId = userId;
      break;
    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: userId } } },
        { assignment: { lesson: { teacherId: userId } } },
      ];
      break;
    case "parent":
      query.student = {
        parentId: userId,
      };
      break;
    default:
      break;
  }
  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                subject: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                subject: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const assesment = item.exam || item.assignment;
    if (!assesment) return null;

    const isExam = "startTime" in assesment;

    return {
      id: item.id,
      title: assesment.title,
      score: item.score,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assesment.lesson.teacher.name,
      classname: assesment.lesson.class.name,
      startTime: isExam ? assesment.startTime : assesment.startDate,
    };
  });

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Score",
      accessor: "score",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
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

  const renderRow = (item: ResultsList) => {
    return (
      <tr
        key={item.id}
        className="border-b odd:bg-macSkyLight even:bg-white hover:bg-macPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.title}</h3>
          </div>
        </td>
        <td className="table-cell ">{`${item.studentName} ${item.studentSurname}`}</td>
        <td className="table-cell ">{item.score}</td>
        <td className="hidden md:table-cell ">{item.teacherName}</td>
        <td className="hidden md:table-cell ">{item.classname}</td>
        <td className="hidden md:table-cell ">
          {new Intl.DateTimeFormat("en-US").format(item.startTime)}
        </td>
        {(role === "admin" || role === "teacher") && (
          <td>
            <div className="flex items-center gap-2">
              <>
                <FormModal
                  type="update"
                  table="result"
                  data={item}
                  id={item.id}
                />
                <FormModal type="delete" table="result" id={item.id} />
              </>
            </div>
          </td>
        )}
      </tr>
    );
  };
  return (
    <div className="white-rounded m-4 mt-0 flex-1">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            {(role === "admin" || role === "teacher") && (
              <FormModal type="create" table="result" />
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

export default ResultsListPage;
