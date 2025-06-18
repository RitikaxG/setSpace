"use client";

import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
} from "react";
import axios from "axios";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  duration: string;
  date: string;
  hour: number;
  minute: number;
  image: string;
}

interface EventContextProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  refetchEvents: () => Promise<void>;
}
const EventContext = createContext<EventContextProps | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const getEvents = async () => {
    try {
      const response = await axios.get(`/api/create-event`);
      setEvents(response.data);
      // console.log(response.data);
    } catch (err) {
      throw new Error(`Error fetching all events ${err}`);
    }
  };
  useEffect(() => {
    getEvents();
  }, []);

  // Memoizing the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ events, setEvents, refetchEvents: getEvents }),
    [events],
  ); // [events] : Dependency array for useMemo hook , context value will only be re-rendered when [events] change

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error(`useEvents must be used within an EventProvider`);
  }
  return context;
};
