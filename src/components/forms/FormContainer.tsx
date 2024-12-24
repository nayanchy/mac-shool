import { FormModalTypes } from "@/lib/types";
import FormModal from "../FormModal";
import prisma from "@/lib/prisma";

const FormContainer = async ({ table, type, data, id }: FormModalTypes) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeacher = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeacher };
        break;
      case "lesson":
        break;
      case "teacher":
        break;
      case "student":
        break;
      case "event":
        break;
      case "parent":
        break;
      case "result":
        break;
      case "exam":
        break;
      case "announcement":
        break;
      case "assignment":
        break;
      case "attendance":
        break;
      case "class":
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
