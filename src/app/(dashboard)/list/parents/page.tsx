import FormModal from "@/components/FormModal";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Parent, Prisma, Student } from "@prisma/client";
import React from "react";

type ParentsList = Parent & { students: Student[] };

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const { role, userId } = await getUserRole();
  const query: Prisma.ParentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = {
              contains: value,
              mode: "insensitive",
            };
            break;
          default:
            break;
        }
      }
    }
  }
  const [parent, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: { students: true },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.parent.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student Name",
      accessor: "students",
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
    role === "admin" && { header: "Actions", accessor: "actions" },
  ];

  const renderRow = (item: ParentsList) => {
    return (
      <tr
        key={item.id}
        className="border-b odd:bg-macSkyLight even:bg-white hover:bg-macPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-500">{item?.email}</p>
          </div>
        </td>
        <td className="hidden md:table-cell ">
          {item.students.map((student) => student.name).join(", ")}
        </td>
        <td className="hidden md:table-cell ">{item.phone}</td>
        <td className="hidden md:table-cell ">{item.address}</td>

        {role === "admin" && (
          <td>
            <div className="flex items-center gap-2">
              <>
                <FormModal
                  type="update"
                  table="parent"
                  data={item}
                  id={item.id}
                />
                <FormModal type="delete" table="parent" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            {role === "admin" && <FormModal type="create" table="parent" />}
          </div>
        </div>
      </div>
      {/* List */}
      <div className="">
        <Table columns={columns} row={renderRow} data={parent} />
      </div>
      {/* Pagination */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ParentListPage;
