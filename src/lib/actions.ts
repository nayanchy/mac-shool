"use server";

import prisma from "./prisma";
import { ClassSchema, SubjectSchema } from "./utility";

type CurrentState = {
  success: boolean;
  error: boolean;
};

/**
 * Creates a new subject
 *
 * @param currentState - The current state of the request
 * @param data - The data for the new subject
 * @returns An object with `success` and `error` properties
 */
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  let state = { success: false, error: false };
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
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

/**
 * Updates an existing subject.
 *
 * @param currentState - The current state of the request
 * @param data - The data for updating the subject, including its ID, name, and teachers
 * @returns An object with `success` and `error` properties indicating the result of the update operation
 */

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
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
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

/**
 * Deletes an existing subject.
 *
 * @param currentState - The current state of the request
 * @param data - The data for deleting the subject, including its ID
 * @returns An object with `success` and `error` properties indicating the result of the delete operation
 */
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

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  let state = { success: false, error: false };
  try {
    await prisma.class.create({
      data: {
        name: data.name,
        // teacher: {
        //   connect: { id: data.teacher },
        // },
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

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
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

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
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
