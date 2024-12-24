import React from "react";
import CountChart from "../CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const total = await prisma.student.count();

  const [boysCount, girlsCount] = await prisma.$transaction([
    prisma.student.count({ where: { sex: "MALE" } }),
    prisma.student.count({ where: { sex: "FEMALE" } }),
  ]);

  const dataSet = [
    {
      name: "Total",
      count: total,
      fill: "white",
    },
    {
      name: "Boys",
      count: boysCount,
      fill: "#C3EBFA",
    },
    {
      name: "Girls",
      count: girlsCount,
      fill: "#FAE27C",
    },
  ];

  return <CountChart data={dataSet} />;
};

export default CountChartContainer;
