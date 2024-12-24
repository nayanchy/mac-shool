import Image from "next/image";
import React from "react";

const InfoCards = ({
  image,
  title,
  alt,
  value,
}: {
  image: string;
  title: string;
  alt: string;
  value: string;
}) => {
  return (
    <div className="white-rounded w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] flex justify-start gap-4 items-center">
      <Image src={image} alt={alt} width={24} height={24} className="w-6 h-6" />
      <div className=" flex flex-col gap-2">
        <h1 className="text-xl font-semibold">{value}</h1>
        <span className="text-sm text-gray-400">{title}</span>
      </div>
    </div>
  );
};

export default InfoCards;
