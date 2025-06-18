"use client";

import FilterEvents from "@/components/FilterEvents";
import EventNavbar from "@/components/EventNavbar";
import { useEvents } from "@/app/contexts/EventContext";
import Event from "./myEvent";

type EventProps = {
  id: number;
  title: string;
  description: string;
  date: string;
  hour: number;
  minute: number;
  duration: string;
  location: string;
  image: string;
};

export default function ExploreEventsClient() {
  const { events } = useEvents();
  // console.log(events);
  return (
    <div className="flex flex-col">
      <EventNavbar />
      <div className="flex">
        <FilterEvents />
        <div className="flex flex-wrap gap-8 p-6 overflow-y-auto max-h-screen">
          {events.map((event: EventProps) => (
            <Event
              id={event.id}
              key={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              hour={event.hour}
              minute={event.minute}
              duration={event.duration}
              location={event.location}
              imageUrl={event.image}
              isBooked={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
