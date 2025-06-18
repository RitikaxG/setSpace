"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { redirect } from "next/navigation";

interface EventProps {
  id: number;
  title: string;
  description: string;
  date: string;
  hour: number;
  minute: number;
  duration: string;
  imageUrl: string;
  location: string;
  isBooked: boolean;
}
export default function Event({
  id,
  title,
  description,
  date,
  hour,
  minute,
  duration,
  imageUrl,
  location,
  isBooked = false,
}: EventProps) {
  const dur = duration.split(",");
  const totalDur = `${dur[0]} hr ${dur[1]} min`;

  const day = date.split("T");
  const today = day[0];

  const hr = String(hour).padStart(2, "0");
  const min = String(minute).padStart(2, "0");
  const [message, setMessage] = useState("");

  const BookEvent = async () => {
    try {
      await axios.post("/api/book-events", {
        eventId: id,
      });
      setMessage("Event Booked Successfully!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          redirect("/signup");
        } else if (err.response?.status === 400) {
          setMessage("Event already booked.");
        } else {
          setMessage("Failed to book event");
        }
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };
  return (
    <div
      className={`${isBooked ? "flex w-290 h-70" : "flex flex-col w-100 h-130"} p-4 bg-[#1c1c1e] rounded-md justify-center gap-2 border-1 border-gray-700 shadow-md`}
    >
      <div className="w-full h-60 overflow-hidden">
        <Image
          width={500}
          height={300}
          className="object-cover rounded-md"
          alt="event-pic"
          src={imageUrl}
        />
      </div>

      <div
        className={`${!isBooked ? "" : "justify-center items-center flex flex-col"}flex flex-col`}
      >
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-400">{totalDur}</div>

          <div className="text-xl font-bold">{title}</div>

          <div
            className={` ${!isBooked ? "" : "w-[85%] pb-4 flex flex-wrap text-sm"}text-gray-400`}
          >
            {description}
          </div>

          <div className={`${!isBooked ? "flex flex-col" : "flex"} gap-2`}>
            <div className="flex gap-5">
              <div className="flex gap-2">
                <div>
                  <Calendar className="mt-1" size={18} />
                </div>
                <div className="text-gray-300 font-bold">{today}</div>
              </div>

              <div className="flex gap-2">
                <div>
                  <Clock className="mt-1" size={18} />
                </div>
                <div className="font-bold">
                  {hr} : {min}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className={`${!isBooked ? "mt-5" : ""}`}>
                <MapPin size={18} />
              </div>

              <div className="flex flex-col gap-1">
                {!isBooked ? (
                  <div className="text-sm text-gray-400">Location</div>
                ) : (
                  ""
                )}
                <div className="font-bold">{location}</div>
              </div>
            </div>
          </div>
        </div>

        {!isBooked ? (
          <button
            onClick={() => {
              BookEvent();
            }}
            className="flex justify-start bg-indigo-500  w-fit py-2 px-3 rounded-md mt-4 font-bold hover:bg-blue-400"
            type="button"
          >
            Book Event
          </button>
        ) : (
          ""
        )}
        <div className="text-blue-500">{message}</div>
      </div>
    </div>
  );
}
