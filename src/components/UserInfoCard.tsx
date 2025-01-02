import Image from "next/image";
import React from "react";
import { TeacherData } from "@/lib/types";
import FormContainer from "./forms/FormContainer";

const UserInfoCard = ({
  edit,
  data,
}: {
  edit?: boolean;
  data: TeacherData;
}) => {
  const formattedBirthday = new Date(data.birthday).toLocaleDateString();
  return (
    <div className="bg-macSky py-6 px-4 rounded-md flex-1 flex gap-4">
      <div className="w-1/3">
        <FormContainer type="update" table="teacher" data={data} />

        {data.img && (
          <Image
            src={data.img || "/noAvatar.png"}
            alt=""
            width={144}
            height={144}
            className="w-36 h-36 rounded-full object-cover"
          />
        )}
      </div>
      <div className="w-2/3 flex flex-col justify-between gap-4">
        <h2 className="text-xl font-semibold">{`${data.name} ${data.surname}`}</h2>
        <p className="text-sm text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
            <Image
              src="/blood.png"
              alt="blood"
              width={14}
              height={14}
              className=""
            />
            <span>B+</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
            <Image
              src="/date.png"
              alt="blood"
              width={14}
              height={14}
              className=""
            />
            <span>{formattedBirthday}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
            <Image
              src="/mail.png"
              alt="blood"
              width={14}
              height={14}
              className=""
            />
            <span>{data.email || "-"}</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
            <Image
              src="/phone.png"
              alt="blood"
              width={14}
              height={14}
              className=""
            />
            <span>{data.phone || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
