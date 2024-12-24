import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
  const user: any = await currentUser();
  // console.log(user);
  return (
    <div className="flex items-center justify-end md:justify-between p-4">
      {/* Search Bar */}
      <SearchBar mobileHidden={true} />
      {/* Icons and User */}
      <div className="flex items-center gap-6">
        <div className="bg-white rounded-full w-7 h-7 flex justify-center items-center relative">
          <Link href="/">
            <Image
              src="/message.png"
              alt="message"
              width={20}
              height={20}
              className=""
            />
            <div className="absolute -top-3 -right-3 w-5 h-5 flex justify-center items-center bg-purple-500 text-white rounded-full text-xs">
              1
            </div>
          </Link>
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex justify-center items-center relative">
          <Link href="/">
            <Image
              src="/announcement.png"
              alt="message"
              width={20}
              height={20}
              className=""
            />
            <div className="absolute -top-3 -right-3 w-5 h-5 flex justify-center items-center bg-purple-500 text-white rounded-full text-xs">
              3
            </div>
          </Link>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {`${user?.firstName} ${user?.lastName}`}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata.role.toUpperCase()}
          </span>
        </div>
        {/* <Image
          src="/avatar.png"
          width={36}
          height={36}
          alt="avatar"
          className="rounded-full"
        /> */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
