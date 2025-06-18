import { z } from "zod";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.object({
    // Values treated as integers
    hour: z.string(),
    minute: z.string(),
  }),

  duration: z.string().refine(
    (val) => {
      const parts = val.split(",").map((x) => Number(x.trim()));
      return parts.length === 2 && parts.every((n) => !Number.isNaN(n));
    },
    {
      message: "Duration must be in format `hours,minutes`",
    },
  ),

  location: z.string().min(1, "City is required"),

  image: z.custom(
    (files) => {
      // Safe check: only do this if FileList is defined (i.e., we're in the browser)
      if (typeof FileList === "undefined") return false;

      return (
        files instanceof FileList &&
        files.length > 0 &&
        files[0].type.startsWith("image/")
      );
    },
    {
      message: "Please upload a valid image",
    },
  ),
});

export default eventFormSchema;
