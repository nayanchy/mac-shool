import UserCard from "@/components/UserCard";
import React from "react";
import FinanceChart from "@/components/FinanceChart";
import Announcement from "@/components/Announcement";
import CountChartContainer from "@/components/containers/CountChartContainer";
import AttendanceChartContainer from "@/components/containers/AttendanceChartContainer";
import CalendarContainer from "@/components/containers/CalendarContainer";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* Left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User */}
        <div className="flex gap-2 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="admin" />
        </div>

        {/* Middle Chart */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Count Chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* Attendence Chart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>

        {/* Bottom Chart */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* Right */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <CalendarContainer searchParams={searchParams} />
        <Announcement />
      </div>
    </div>
  );
};

export default AdminPage;
