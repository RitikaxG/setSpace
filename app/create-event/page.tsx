import EventForm from "@/components/CreateEventForm";
import EventNavbar from "@/components/EventNavbar";

export default function EventFormPage() {
  return (
    <div className="flex flex-col">
      <EventNavbar />
      <EventForm />
    </div>
  );
}
