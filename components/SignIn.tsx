"use client";

import Image from "next/image";
import { Github } from "lucide-react";
import { useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Google from "../public/assets/Google.webp";
import LabelledInput from "./LabelledInput";

export default function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSubmit = async () => {
    if (emailRef.current?.value && passwordRef.current?.value) {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const response = await signIn("credentials", {
        redirect: false, // signIn fn redirect user automatically after a successful login, redirect: false give user control of what will happen next
        email,
        password,
      });

      if (response?.ok) {
        router.push("/");
      } else {
        throw new Error("Login Failed");
      }
    }
  };

  const googleSignIn = async () => {
    const response = await signIn("google", { redirect: false });

    if (response?.ok) {
      router.push("/");
    } else {
      throw new Error("Login with Google Failed");
    }
  };

  const githubSignIn = async () => {
    const response = await signIn("github", { redirect: false });

    if (response?.ok) {
      router.push("/");
    } else {
      throw new Error("Login with Github Failed");
    }
  };

  const inputStyle = `p-2 bg-gray-700 mb-4 rounded-md`;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-xl h-fit p-10 bg-gray-900 flex flex-col rounded-md">
        <div className="text-5xl font-medium flex justify-center mb-10">
          Welcome Back
        </div>

        <LabelledInput
          ref={emailRef}
          className={inputStyle}
          type="email"
          placeholder="Email"
        />
        <LabelledInput
          ref={passwordRef}
          className={inputStyle}
          type="password"
          placeholder="Password"
        />

        <button
          type="button"
          onClick={() => {
            handleSubmit();
          }}
          className="w-full bg-white text-black font-semibold py-3 rounded-md mt-2 hover:bg-blue-500 hover:text-white cursor-pointer"
        >
          Login
        </button>

        <div className="flex items-center gap-2 mt-10 w-full">
          <div className="border-t border-gray-300 flex-grow" />
          <div className="text-gray-200 text-sm">or</div>
          <div className="h-px bg-gray-300 flex-grow" />
        </div>

        <div className="flex w-full gap-4 mt-8 px-14 justify-center">
          <button
            type="button"
            onClick={googleSignIn}
            className="flex gap-4 w-full justify-center border-1 border-gray-500 py-4 rounded-2xl hover:bg-blue-500 hover:text-white hover:opacity-100 cursor-pointer"
          >
            <Image className="w-6 h-6" src={Google} alt="Google" />
            <div>Google</div>
          </button>

          <button
            type="button"
            onClick={githubSignIn}
            className="flex gap-4 w-full justify-center border-1 border-gray-500 py-4 rounded-2xl hover:bg-blue-500 hover:text-white hover:opacity-100 cursor-pointer"
          >
            <Github />
            <div>Github</div>
          </button>
        </div>
      </div>
    </div>
  );
}
