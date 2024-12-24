"use client";
import { dataType, getCount } from "@/lib/utility";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ data }: { data: dataType }) => {
  const { singleCount: boysCount, percentage: boysPercentage } = getCount(
    data,
    "Boys"
  );
  const { singleCount: girlsCount, percentage: girlsPercentage } = getCount(
    data,
    "Girls"
  );
  return (
    <div className=" bg-white rounded-xl w-full h-full p-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      {/* Chart */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt="chart"
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* Bottom */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-macSky rounded-full" />
          <h1 className="font-bold">{boysCount}</h1>
          <h2 className="text-xs">{`Boys (${boysPercentage.toFixed(2)}%)`}</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-macYellow rounded-full" />
          <h1 className="font-bold">{girlsCount}</h1>
          <h2 className="text-xs">{`Girls (${girlsPercentage.toFixed(
            2
          )}%)`}</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
