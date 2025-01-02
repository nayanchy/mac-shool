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

export type TeacherData = {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img: string;
  bloodgroup: string;
  sex: string;
  createdAt: Date;
  birthday: Date;
};
