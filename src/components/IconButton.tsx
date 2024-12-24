import Image from "next/image";
import React from "react";

const IconButton = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return (
    <button
      className={`flex items-center justify-center w-8 h-8 bg-macYellow rounded-full ${className}`}
    >
      <Image src={src} alt={alt} width={14} height={14} />
    </button>
  );
};

export default IconButton;
