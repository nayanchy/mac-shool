import Image from "next/image";
import React from "react";
import FormModal from "./FormModal";

const UserInfoCard = ({ edit }: { edit?: boolean }) => {
  return (
    <div className="bg-macSky py-6 px-4 rounded-md flex-1 flex gap-4">
      <div className="w-1/3">
        <FormModal
          type="update"
          table="teacher"
          data={{
            id: 1,
            username: "RakibulIslam",
            email: "Nl0z9@example.com",
            password: "123456789",
            firstName: "Rakib",
            lastName: "Islam",
            phone: "01712345678",
            address: "Dhaka, Bangladesh",
            birthday: "1988-10-14T00:00:00.000Z",
            bloodGroup: "A+",
            sex: "male",
            img: null,
          }}
        />

        <Image
          src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt=""
          width={144}
          height={144}
          className="w-36 h-36 rounded-full object-cover"
        />
      </div>
      <div className="w-2/3 flex flex-col justify-between gap-4">
        <h2 className="text-xl font-semibold">Nayan Chowdhury</h2>
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
            <span>October 14, 1988</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
            <Image
              src="/mail.png"
              alt="blood"
              width={14}
              height={14}
              className=""
            />
            <span>nayan.1aacl@gmail.com</span>
          </div>
          <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
            <Image
              src="/phone.png"
              alt="blood"
              width={14}
              height={14}
              className=""
            />
            <span>01780154515</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
