"use client";

import Navbar from "../components/Navbar";
// import { authOptions } from "@/lib/auth";
// import { getServerSession } from "next-auth";
// import { SessionProvider, signOut, useSession } from "next-auth/react";
import Footer from "../components/Footer";
import LandingPage from "../components/LandingPage";

// Getting user details in a client component

// export default function Provider () {
//     return <SessionProvider>
//         <Home/>
//     </SessionProvider>
// }

// const Home = () => {
//     const session = useSession();
//     return <div>Welcome {session.data?.user?.name}</div>
// }

// // Getting user details in a server component

// export default async function Home() {
//     const session = await getServerSession();

//     return <div>Welcome {JSON.stringify(session?.user?.name)}</div>
// }

// Wrap RootLayout with Provider and use useSession directly in "/"

// export default function Home() {
//     const session = useSession();

//     return <div>
//             <div>{session.data?.user?.name}</div>
//             <button onClick={()=>{
//                 signOut()
//             }}>Sign Out</button>
//         </div>

// }

export default function Landing() {
  return (
    <div>
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
}
