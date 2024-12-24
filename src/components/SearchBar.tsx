import Image from "next/image";
import React from "react";

const SearchBar = ({
  mobileHidden,
  className,
}: {
  mobileHidden?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`${
        mobileHidden && "hidden md:flex"
      } ring-[1.5px] text-xs ring-gray-300 px-2 gap-2 rounded-full items-center ${className}`}
    >
      <Image src="/search.png" alt="search" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default SearchBar;
