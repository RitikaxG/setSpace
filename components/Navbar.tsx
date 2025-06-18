"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../public/assets/logo.png";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="w-screen h-16 py-8 bg-white justify-between items-center flex pr-14">
      <div>
        <Image
          className="object-contain pt-6"
          src={Logo}
          alt="logo"
          width={140}
          height={100}
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            router.push("/signup");
          }}
          className="hover:bg-black hover:text-white py-2 px-3 rounded-md bg-white text-black"
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/signin");
          }}
          className="hover:bg-black hover:text-white py-2 px-3 rounded-md bg-white text-black"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
