import FormContainer from "@/components/forms/FormContainer";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { Prisma, Subject, Teacher } from "@prisma/client";
import React from "react";

type SubjectList = Subject & { teachers: Teacher[] };

const SubjectsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;
  const { role } = await getUserRole();
  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = {
              contains: value,
              mode: "insensitive",
            };
        }
      }
    }
  }

  const [subjectData, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: { teachers: true },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
      className: "hidden md:table-cell",
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" ? [{ header: "Actions", accessor: "actions" }] : []),
  ];
  const renderRow = (item: SubjectList) => {
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
        <td className="hidden md:table-cell ">
          {item.teachers.map((teacher) => teacher.name).join(", ")}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormContainer
                  type="update"
                  table="subject"
                  data={item}
                  id={item.id}
                />
                <FormContainer type="delete" table="subject" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <SearchBar className="w-full md:w-auto flex" />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            <FormContainer type="create" table="subject" />
          </div>
        </div>
      </div>
      {/* List */}
      <div className="">
        <Table columns={columns} row={renderRow} data={subjectData} />
      </div>
      {/* Pagination */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default SubjectsListPage;
