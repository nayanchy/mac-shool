"use client";
import Calendar from "react-calendar";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date)
      router.push(`?date=${value.toLocaleDateString("en-US")}`);
    // router.push(`?date=${value}`);
  }, [value, router]);

  return <Calendar onChange={onChange} value={value} />;
};

export default EventCalendar;
