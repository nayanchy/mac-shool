"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Spinner from "./Spinner";
import { useFormState } from "react-dom";
import { deleteSubject } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FormModalTypes } from "@/lib/types";

const deleteActionMap = {
  subject: deleteSubject,
  // class: deleteClass,
  // teacher: deleteTeacher,
  // student: deleteStudent,
  // parent: deleteParent,
  // exam: deleteExam,
  // assignment: deleteAssignment,
  // result: deleteResult,
  // attendance: deleteAttendance,
  // event: deleteEvent,
  // announcement: deleteAnnouncement,
  // lesson: deleteLesson,
};

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <Spinner />,
});

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <Spinner />,
});

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <Spinner />,
});
const FormModal = ({ table, type, data, id }: FormModalTypes) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-macYellow"
      : type === "update"
      ? "bg-macSky"
      : "bg-macPurple";
  const image =
    type === "create"
      ? "/plus.png"
      : type === "update"
      ? "/edit.png"
      : "/delete.png";
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable scrolling
    }

    return () => {
      document.body.style.overflow = ""; // Ensure cleanup on unmount
    };
  }, [open]);
  const forms: {
    [key: string]: (
      type: "create" | "update",
      data?: any,
      handleModal?: () => void,
      relatedData?: any
    ) => JSX.Element;
  } = {
    teacher: (type, data, handleModal, relatedData) => (
      <TeacherForm
        type={type}
        data={data}
        handleModal={handleClick}
        // relatedData={relatedData}
      />
    ),
    student: (type, data, handleModal, relatedData) => (
      <StudentForm
        type={type}
        data={data}
        handleModal={handleClick}
        // relatedData={relatedData}
      />
    ),
    subject: (type, data, handleModal, relatedData) => (
      <SubjectForm
        type={type}
        data={data}
        handleModal={handleClick}
        // relatedData={relatedData}
      />
    ),
  };
  const Form = () => {
    // const [state, formAction] = useFormState(deleteActionMap[table], {
    //   success: false,
    //   error: false,
    // });

    // const router = useRouter();
    // const { toast } = useToast();

    // useEffect(() => {
    //   if (state.success) {
    //     toast({
    //       title: `The ${table} was successfully deleted`,
    //     });
    //     router.refresh();
    //   }
    // }, [state, router, toast]);

    return type === "delete" && id ? (
      <form className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium text-sm">
          All data will be deleted. Are you sure you want to delete the item?
        </span>
        <button
          type="submit"
          className="bg-red-500 border-none text-white py-2 px-4 rounded-md w-max self-center"
        >
          Delete
        </button>
      </form>
    ) : type === "update" || type === "create" ? (
      forms[table](type, data, handleClick)
    ) : (
      "Forms are not created yet"
    );
  };
  return (
    <>
      <button
        className={`${size} ${bgColor} flex items-center justify-center rounded-full`}
        onClick={handleClick}
      >
        <Image src={image} alt={type} height={14} width={14} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute top-0 left-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overscroll-none overflow-hidden">
          <div className="white-rounded w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] relative">
            <div className="absolute top-2 right-4">
              <button onClick={handleClick}>
                <Image src="/close.png" alt={type} height={14} width={14} />
              </button>
            </div>
            <Form />
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
