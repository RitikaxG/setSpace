"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEvents } from "@/app/contexts/EventContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Logo from "../public/assets/logo.png";
import Avatar from "../public/avatar.png";

export function DropDown() {
  const router = useRouter();
  // eslint-disable-next-line
  const { data: session, status } = useSession();
  const buttonStyle = `hover:text-blue-500 bg-white text-black p-2 rounded-md`;
  return (
    <div className="flex flex-col absolute top-15 -right-1">
      {status === "authenticated" ? (
        <button
          onClick={() => {
            signOut();
          }}
          className={buttonStyle}
          type="button"
        >
          Logout
        </button>
      ) : (
        <button
          className={buttonStyle}
          onClick={() => {
            router.push("/signin");
          }}
          type="button"
        >
          Login
        </button>
      )}
    </div>
  );
}

export default function EventNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [btn, setBtn] = useState("explore");

  //   const name = session.data?.user?.name?.split(" ");
  //   const myName = name?.[0] ?? "User";
  // eslint-disable-next-line
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isDropdown, setIsDropdown] = useState(false);
  const { setEvents } = useEvents();
  const refetchEvents = async () => {
    const response = await axios.get(`/api/create-event`);
    setEvents(response.data);
  };

  useEffect(() => {
    if (pathname.includes("explore")) {
      setBtn("explore");
    } else if (pathname.includes("book")) {
      setBtn("book");
    } else {
      setBtn("create");
    }
    const getProfilePic = async () => {
      const response = await axios.get("/api/get-profile-pic");
      setUserDetails(response.data);
    };
    getProfilePic();
    console.log(userDetails);
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <div className="w-screen h-16 py-8 bg-white justify-between items-center flex pr-10">
      <div>
        <Image
          className="object-contain pt-6"
          src={Logo}
          alt="logo"
          width={140}
          height={100}
        />
      </div>

      <div className="flex gap-3">
        {btn === "explore" ? (
          <div>
            <button
              className="rounded-md p-2"
              onClick={() => {
                refetchEvents();
              }}
              type="button"
            >
              <RotateCcw className="text-black mt-1.5 hover:text-blue-500" />
            </button>
          </div>
        ) : (
          ""
        )}

        <div className="flex gap-2">
          {btn === "explore" || btn === "book" ? (
            <button
              onClick={() => {
                router.push("create-event");
              }}
              className="bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-blue-500 font-semibold"
              type="button"
            >
              Create Event
            </button>
          ) : (
            ""
          )}

          {btn === "create" ? (
            <button
              onClick={() => {
                router.push("explore-events");
              }}
              className="bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-blue-500 font-semibold"
              type="button"
            >
              Explore Events
            </button>
          ) : (
            ""
          )}

          {btn === "explore" || btn === "create" ? (
            <button
              onClick={() => {
                router.push("my-booked-events");
              }}
              className="bg-black text-white py-2 px-3 rounded-md hover:opacity-80 font-semibold"
              type="button"
            >
              My Events
            </button>
          ) : (
            ""
          )}
          {btn === "book" ? (
            <button
              onClick={() => {
                router.push("explore-events");
              }}
              className="bg-black text-white py-2 px-3 rounded-md hover:opacity-80 font-semibold"
              type="button"
            >
              Explore Events
            </button>
          ) : (
            ""
          )}
        </div>

        <div className="flex flex-col relative mt-1">
          <button
            type="button"
            onClick={() => {
              setIsDropdown((drop) => !drop);
            }}
          >
            <Image
              className="rounded-full"
              width={44}
              height={44}
              src={userDetails?.image || Avatar}
              alt="user-profile"
            />
          </button>
          {isDropdown ? <DropDown /> : ""}
        </div>
      </div>
    </div>
  );
}
