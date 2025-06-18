"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { useEvents } from "@/app/contexts/EventContext";
import CityAutocompleteInput from "./CityAutoCompleteInput";

export default function FilterEvents() {
  const inputStyle = "border-b-1 border-gray-300 outline-none w-60 rounded-sm";
  const [city, setCity] = useState("");
  const locationRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const { setEvents } = useEvents();

  const filterEvents = async () => {
    try {
      const response = await axios.post("/api/filter-events", {
        location: city,
        title: titleRef.current?.value || "",
        date: dateRef.current?.value || "",
      });
      const events = response.data;
      setEvents(events);
    } catch (err) {
      throw new Error(`Error filtering events ${err}`);
    }
  };

  return (
    <div className="h-screen w-70 bg-black text-white px-4 py-12 flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="font-semibold text-xl pb-10">Filter Events</div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Location</div>
            <CityAutocompleteInput
              reference={locationRef}
              className={inputStyle}
              value={city}
              onChange={(val) => {
                setCity(val);
              }}
            />
          </div>

          <label htmlFor="name" className="flex flex-col">
            <div className="font-semibold">Name</div>
            <input
              ref={titleRef}
              placeholder="Title here"
              id="name"
              className={inputStyle}
              type="text"
            />
          </label>

          <label htmlFor="date" className="flex flex-col">
            <div className="font-semibold">Date</div>
            <input
              ref={dateRef}
              className="custom-date-picker"
              id="date"
              type="date"
              style={{ colorScheme: "light" }}
            />
          </label>
        </div>
      </div>

      <button
        onClick={() => {
          filterEvents();
        }}
        type="button"
        className="bg-indigo-500 hover:bg-blue-500 text-white py-3 w-full rounded-lg"
      >
        APPLY FILTERS
      </button>
    </div>
  );
}
