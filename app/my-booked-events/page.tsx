import BookedEvents from "@/components/BookedEvents";
import EventNavbar from "@/components/EventNavbar";

export default function BookedEventsPage() {
  return (
    <div className="flex flex-col">
      <EventNavbar />
      <BookedEvents />;
    </div>
  );
}
