import FormModal from "@/components/FormModal";
import FormContainer from "@/components/forms/FormContainer";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Teacher } from "@prisma/client";
import React from "react";

type ClassesList = Class & { supervisor: Teacher };

const ClassesListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const { role, userId } = await getUserRole();

  // URL Parameter Conditions
  const query: Prisma.ClassWhereInput = {};
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          case "supervisorId":
            query.supervisorId = value;
            break;
          default:
            break;
        }
      }
    });
  }

  const [classesData, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: { supervisor: true },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.class.count({
      where: query,
    }),
  ]);

  const columns = [
    {
      header: "Class Name",
      accessor: "name",
    },
    {
      header: "Capacity",
      accessor: "capacity",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Supervisor",
      accessor: "supervisor",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" ? [{ header: "Actions", accessor: "actions" }] : []),
  ];

  const renderRow = (item: ClassesList) => {
    return (
      <tr
        key={item.id}
        className="border-b odd:bg-macSkyLight even:bg-white hover:bg-macPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
          </div>
        </td>
        <td className="hidden md:table-cell ">{item.capacity}</td>
        <td className="hidden md:table-cell ">{item.name[0]}</td>
        <td className="hidden md:table-cell ">{item.supervisor.name}</td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormContainer
                  type="update"
                  table="class"
                  data={item}
                  id={item.id}
                />
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
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <SearchBar className="w-full md:w-auto flex" />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            <FormModal type="create" table="class" />
          </div>
        </div>
      </div>
      {/* List */}
      <div className="">
        <Table columns={columns} row={renderRow} data={classesData} />
      </div>
      {/* Pagination */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClassesListPage;
