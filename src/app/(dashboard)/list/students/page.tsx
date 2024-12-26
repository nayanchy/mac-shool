import FormModal from "@/components/FormModal";
import FormContainer from "@/components/forms/FormContainer";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type StudentList = Student & { class: Class };

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;
  const { role, userId } = await getUserRole();
  const query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.class = {
              lessons: {
                some: {
                  teacherId: value,
                },
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

  const [student, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student Id",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
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
  const renderRow = (item: StudentList) => {
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
            <p className="text-xs text-gray-500">{item?.class.name}</p>
          </div>
        </td>
        <td className="hidden md:table-cell ">{item.username}</td>
        <td className="hidden md:table-cell ">{item.class.name[0]}</td>
        <td className="hidden md:table-cell ">{item.phone}</td>
        <td className="hidden md:table-cell ">{item.address}</td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/students/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-macSky">
                <Image src="/view.png" alt="view" width={16} height={16} />
              </button>
            </Link>
            {role === "admin" && (
              <>
                <FormContainer type="delete" table="class" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            {role === "admin" && <FormContainer type="create" table="class" />}
          </div>
        </div>
      </div>
      {/* List */}
      <div className="">
        <Table columns={columns} row={renderRow} data={student} />
      </div>
      {/* Pagination */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default StudentListPage;
