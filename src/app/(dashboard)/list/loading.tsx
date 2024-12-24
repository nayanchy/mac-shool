import Spinner from "@/components/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <Spinner />;
    </div>
  );
};

export default Loading;
