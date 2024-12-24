import FormModal from "@/components/FormModal";
import IconButton from "@/components/IconButton";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getUserRole } from "@/lib/authentication";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { formatHoursMinutes } from "@/lib/utility";
import { Event, Prisma } from "@prisma/client";
import React from "react";

type EventsList = Event & {
  class: {
    name: string;
  };
};

const EventsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const { role, userId } = await getUserRole();
  const query: Prisma.EventWhereInput = {};

  // URL Parameter Conditions
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
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
      query.OR = [
        { classId: null },
        { class: { lessons: { some: { teacherId: userId } } } },
      ];
      break;
    case "student":
      query.OR = [
        { classId: null },
        { class: { students: { some: { id: userId } } } },
      ];
      break;
    case "parent":
      query.OR = [
        { classId: null },
        { class: { students: { some: { parentId: userId } } } },
      ];
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: {
          select: { name: true },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden lg:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden lg:table-cell",
    },
    role === "admin" && { header: "Actions", accessor: "actions" },
  ];

  const renderRow = (item: EventsList) => {
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
        <td className="hidden md:table-cell ">{item.class?.name || "-"}</td>
        <td className="hidden md:table-cell ">
          {new Intl.DateTimeFormat("en-US").format(item.startTime)}
        </td>
        <td className="hidden md:table-cell ">
          {formatHoursMinutes(item.startTime)}
        </td>
        <td className="hidden md:table-cell ">
          {formatHoursMinutes(item.endTime)}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormModal
                  type="update"
                  table="event"
                  data={item}
                  id={item.id}
                />
                <FormModal type="delete" table="event" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
          <TableSearch />
          <div className="flex gap-2 items-center self-end">
            <IconButton src="/filter.png" alt="filter" />
            <IconButton src="/sort.png" alt="sort" />
            <FormModal type="create" table="event" />
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

export default EventsListPage;
