"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import eventFormSchema from "@/lib/schemas/eventFormSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEvents } from "@/app/contexts/EventContext";
import CityAutocompleteInput from "./CityAutoCompleteInput";

// type PlacesAutocompleteInputProps = {
//   // eslint-disable-next-line no-unused-vars
//   onSelect: (city: string) => void;
// };
// function PlacesAutocompleteInput({ onSelect }: PlacesAutocompleteInputProps) {
//   const {
//     ready, // Becomes true when places API is ready to use
//     setValue,
//     value,
//     suggestions: { status, data }, // autocomplete suggestion data
//     clearSuggestions,
//   } = usePlacesAutocomplete({
//     requestOptions: { types: ["cities"] },
//   });

//   // Triggered when user inputs value
//   const handleSelect = (suggestion: { description: string }) => {
//     setValue(suggestion.description, false);
//     clearSuggestions();
//     onSelect(suggestion.description); // set input box value and passes it back to react hook form
//   };

//   return (
//     <div>
//       <input
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         disabled={!ready}
//         placeholder="Choose your city"
//       />
//       {status === "OK" && (
//         <ul>
//           {data.map((suggestion) => (
//             <li key={suggestion.place_id}>
//               <button
//                 type="button"
//                 onClick={() => {
//                   handleSelect(suggestion);
//                 }}
//               >
//                 {suggestion.description}
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

type eventFormData = z.infer<typeof eventFormSchema>;

export default function EventForm() {
  const router = useRouter();
  const { refetchEvents } = useEvents();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<eventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      time: {
        hour: "00",
        minute: "00",
      },
      duration: "0,0",
    },
  });

  const handleFormData = async (data: eventFormData) => {
    try {
      /* req.json() expects a Content-Type: application/json. But files (like images) must be sent as multipart/form-data.
      Create a new FormData object that can handle both text and files. */

      // FormData requires values to be either string or blob

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("hour", data.time.hour);
      formData.append("minute", data.time.minute);
      formData.append("duration", data.duration);
      formData.append("location", data.location);

      const imageFile = (data.image as FileList)[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("/api/create-event", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await refetchEvents();
      router.push("/explore-events");
    } catch (err) {
      throw new Error(`Error creating new event ${err}`);
    }
  };

  const inputStyle = `bg-[#1c1c1e] text-white placeholder-gray-400 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5eead4] transition`;
  const errorStyle = `text-sm text-red-400 mt-1`;

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-r from-blue-400 via-green-400 to-indigo-400">
      <div className="p-8 bg-[#0D0D0D] text-white flex flex-col w-full max-w-2xl rounded-xl shadow-xl shadow-emerald-500/10">
        <div className="text-4xl font-semibold flex justify-start pb-5">
          Create Event
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleFormData)}
        >
          {/* Title Input */}
          <label htmlFor="title" className="flex flex-col gap-2">
            <div className="font-semibold">TITLE</div>
            <input
              className={inputStyle}
              id="title"
              type="text"
              placeholder="Title here"
              {...register("title")}
            />
            {errors.title && (
              <p className={errorStyle}>{errors.title.message}</p>
            )}
          </label>

          {/* Description Input */}
          <label htmlFor="desc" className="flex flex-col gap-2">
            <div className="font-semibold">DESCRIPTION</div>
            <textarea
              className={`${inputStyle} h-32`}
              id="desc"
              placeholder="Description here"
              {...register("description")}
            />
            {errors.description && (
              <p className={errorStyle}>{errors.description.message}</p>
            )}
          </label>

          <div className="flex justify-between">
            {/* Date Input */}
            <label htmlFor="date" className="flex flex-col">
              <div className="font-semibold">DAY</div>
              <input
                className={inputStyle}
                id="date"
                type="date"
                {...register("date")}
              />
              {errors.date && (
                <p className={errorStyle}>{errors.date.message}</p>
              )}
            </label>

            {/* Hour Input */}
            <div className="flex flex-col">
              <div className="font-semibold">HOUR</div>
              <select className={inputStyle} {...register("time.hour")}>
                {[...Array(24).keys()].map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>

              {errors.time?.hour && (
                <p className={errorStyle}>{errors.time.hour.message}</p>
              )}
            </div>

            {/* Minute Input */}
            <div className="flex flex-col">
              <div className="font-semibold">MINUTE</div>
              <select className={inputStyle} {...register("time.minute")}>
                {[0, 15, 30, 45].map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>

              {errors.time?.minute && (
                <p className={errorStyle}>{errors.time.minute.message}</p>
              )}
            </div>

            {/* Duration Input */}
            <div>
              <div className="font-semibold">DURATION</div>
              <select className={inputStyle} {...register("duration")}>
                {[...Array(6).keys()].map((hours) =>
                  [0, 15, 30, 45].map((minutes) => (
                    <option
                      key={`${hours}-${minutes}`}
                      value={`${hours}, ${minutes}`}
                    >
                      {hours} hr {minutes ? `${minutes} min` : ""}
                    </option>
                  )),
                )}
              </select>
              {errors.duration && (
                <p className={errorStyle}>{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Location Input */}
          <label htmlFor="location">
            <div className="font-semibold">LOCATION</div>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <CityAutocompleteInput
                  className={`${inputStyle} w-full`}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.location && (
              <p className={errorStyle}>{errors.location.message}</p>
            )}
          </label>

          {/* Image Input */}
          <label htmlFor="image" className="flex flex-col">
            <div className="font-semibold">UPLOAD IMAGE</div>
            <input
              className={inputStyle}
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
            />
            {errors.image && (
              <p className={errorStyle}>{errors.image.message?.toString()}</p>
            )}
          </label>

          <button
            type="submit"
            className="mt-4 w-full text-white  bg-indigo-500 hover:bg-blue-500 font-bold py-3 px-6 rounded-lg "
          >
            CREATE EVENT
          </button>
        </form>
      </div>
    </div>
  );
}
