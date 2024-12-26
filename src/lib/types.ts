export type FormModalTypes = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "lesson"
    | "exam"
    | "assignment"
    | "attendance"
    | "event"
    | "announcement"
    | "class"
    | "result";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  relatedData?: any;
};

export type FormDefaultProps = {
  type: "create" | "update" | "delete";
  data?: any;
  handleModal: () => void;
  relatedData?: any;
};
