"use client";
import Image from "next/image";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    income: 18000,
    expense: 12490,
  },
  {
    name: "Feb",
    income: 9400,
    expense: 5400,
  },
  {
    name: "March",
    income: 8000,
    expense: 12400,
  },
  {
    name: "April",
    income: 41000,
    expense: 20400,
  },
  {
    name: "May",
    income: 3400,
    expense: 1400,
  },
  {
    name: "Jun",
    income: 14000,
    expense: 12400,
  },
  {
    name: "Jul",
    income: 9876,
    expense: 5487,
  },
  {
    name: "Aug",
    income: 13456,
    expense: 12000,
  },
  {
    name: "Sep",
    income: 45321,
    expense: 23456,
  },
  {
    name: "Oct",
    income: 9080,
    expense: 10980,
  },
  {
    name: "Nov",
    income: 2345,
    expense: 2400,
  },
  {
    name: "Dec",
    income: 15400,
    expense: 10300,
  },
];

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      {/* Chart */}
      <div className="w-full h-[90%]">
        <ResponsiveContainer>
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
            />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
            />
            <Line
              type="natural"
              dataKey="income"
              stroke="#C3EBFA"
              strokeWidth={5}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#CFCEFF"
              strokeWidth={5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceChart;
