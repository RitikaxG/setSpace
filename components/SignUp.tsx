"use client";

// using react-hook-form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { Github } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import signUpSchema from "@/lib/schemas/signupSchema";
import { useRouter } from "next/navigation";
import Google from "../public/assets/Google.webp";
import LabelledInput from "./LabelledInput";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUp = async (data: SignUpFormData) => {
    try {
      await axios.post(`/api/signup`, {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      });
      router.push("/"); // client side navigation
      // console.log("Signup successful");
    } catch (err) {
      throw new Error(`Error signing up ${err}`);
    }
  };

  const googleSignUp = async () => {
    const res = await signIn("google", { redirect: false });

    if (res?.ok) {
      router.push("/");
    } else {
      throw new Error("Error signing up with google");
    }
  };

  const githubSignUp = async () => {
    const res = await signIn("github", { redirect: false });

    if (res?.ok) {
      router.push("/");
    } else {
      throw new Error("Error signing up with github");
    }
  };

  const inputStyle = `p-2 bg-gray-700 rounded-sm w-full`;

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-black">
      <div className="rounded-xl shadow-xl w-xl flex flex-col justify-start bg-gray-900 h-fit p-10">
        <form onSubmit={handleSubmit(signUp)}>
          <div className="text-white text-5xl font-light pb-6">
            Create an Account
          </div>

          <div className="text-gray-400 pb-10 pl-2">
            Already have an account?{" "}
            <Link className="underline text-blue-500" href="/signin">
              Log in
            </Link>
          </div>

          <div className="flex gap-5">
            <div className="flex flex-col mb-4 w-full">
              <LabelledInput
                className={inputStyle}
                {...register("firstname")}
                type="text"
                placeholder="Firstname"
              />

              {errors.firstname && (
                <p className="text-gray-300">{errors.firstname.message}</p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <LabelledInput
                className={inputStyle}
                {...register("lastname")}
                type="text"
                placeholder="Lastname"
              />

              {errors.lastname && (
                <p className="text-gray-300">{errors.lastname.message}</p>
              )}
            </div>
          </div>

          <LabelledInput
            className={`${inputStyle} ${errors.email?.message === "" ? "" : "mb-4"}`}
            {...register("email")}
            type="email"
            placeholder="Enter Email"
          />

          {errors.email && (
            <p className="text-gray-300 mb-4">{errors.email.message}</p>
          )}

          <LabelledInput
            className={inputStyle}
            {...register("password")}
            type="password"
            placeholder="Enter password"
          />

          {errors.password && (
            <p className="text-gray-300 mt-2">{errors.password.message}</p>
          )}

          <button
            className="w-full bg-white font-bold text-black py-3 rounded-md mt-10 cursor-pointer hover:bg-blue-500 hover:border-0.5 hover:border-white hover:text-white"
            type="submit"
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center gap-1 mt-10 w-full">
          <div className="border-t border-gray-300 flex-grow" />
          <div className="text-gray-200 text-sm">or register with</div>
          <div className="h-px bg-gray-300 flex-grow" />
        </div>

        <div className="flex w-full gap-4 mt-8 px-14 justify-center">
          <button
            type="button"
            onClick={googleSignUp}
            className="flex gap-4 w-full justify-center border-1 border-gray-500 py-4 rounded-2xl cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <Image className="w-6 h-6" src={Google} alt="Google" />
            <div>Google</div>
          </button>

          <button
            type="button"
            onClick={githubSignUp}
            className="flex gap-4 w-full justify-center border-1 border-gray-500 py-4 rounded-2xl cursor-pointer hover:bg-blue-500 hover:text-white"
          >
            <Github />
            <div>Github</div>
          </button>
        </div>
      </div>
    </div>
  );
}
