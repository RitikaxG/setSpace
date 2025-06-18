import { z } from "zod";

const signUpSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(3, "Firstname must be atleast 3 characters")
    .max(50),
  lastname: z
    .string()
    .trim()
    .min(3, "Lastname  must be atleast 3 characters")
    .max(50),
  email: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .trim()
    .min(8)
    .max(50)
    .refine((password) => /[A-Z]/.test(password), {
      message: "Must contain atleast one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Must contain atleast one lowercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Must contain atleast one digit",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "Must contain atleast one special character",
    }),
});

export default signUpSchema;
