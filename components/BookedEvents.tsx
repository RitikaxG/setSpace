"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Event from "./myEvent";

export default function BookedEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookedEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXTAUTH_URL}/api/book-events`,
        );
        console.log(response.data);
        setEvents(response.data);
      } catch (err) {
        console.error(`Error fetching booked events ${err}`);
      }
    };

    fetchBookedEvents();
  }, []);

  return (
    <div className="flex flex-col p-8">
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="text-blue-400">Schedule Details</div>
        <div className="text-5xl font-medium">Event Schedule</div>
        <div className="text-center w-[60%] text-gray-400">
          From live music to storytelling nights, each booking is a step toward
          an exciting experience. Stay tuned, mark your calendar, and get ready
          to make memories. This is your space to track what’s next — your next
          moment starts here.
        </div>
      </div>

      <div className="flex flex-col items-center pt-10 gap-8">
        {/* eslint-disable-next-line */}
        {events?.map((booking: any) => (
          <Event
            key={booking.event.id}
            id={booking.event.id}
            title={booking.event.title}
            description={booking.event.description}
            location={booking.event.location}
            date={booking.event.date}
            hour={booking.event.hour}
            minute={booking.event.minute}
            imageUrl={booking.event.image}
            duration={booking.event.duration}
            isBooked
          />
        ))}
      </div>
    </div>
  );
}
