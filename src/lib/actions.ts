"use server";

import prisma from "./prisma";
import { SubjectSchema } from "./utility";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  let state = { success: false, error: false };
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
      },
    });

    return (state = {
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    return (state = { success: false, error: true });
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      },
    });

    return {
      success: true,
      error: false,
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
