"use client";
import Image from "next/image";
import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 92, fill: "#C3EBFA" },
  { name: "Group B", value: 8, fill: "#FAE27C" },
];

const Performance = () => {
  return (
    <div className="white-rounded h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Performance</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-lg font-bold">9.2</h1>
        <p className="text-xs text-gray-300">of 10 max LTS</p>
      </div>
      <h2 className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-sm font-semibold">
        2024 - 2025
      </h2>
    </div>
  );
};

export default Performance;