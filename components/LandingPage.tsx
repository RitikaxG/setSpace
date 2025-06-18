import Image, { StaticImageData } from "next/image";
import { redirect } from "next/navigation";
import Guitar from "../public/assets/guitar.jpeg";
import StandUp from "../public/assets/standup.webp";
import Feature1 from "../public/assets/feature1.webp";
import Feature2 from "../public/assets/feature2.webp";
import Feature3 from "../public/assets/feature3.jpeg";

interface FeatureProps {
  image: string | StaticImageData;
  tag: string;
  subline: string;
}

export function Feature({ image, tag, subline }: FeatureProps) {
  return (
    <div className="rounded-lg relative">
      <div className="opacity-60">
        <Image className="rounded-lg" width={400} src={image} alt="feature" />
      </div>

      <div className="absolute bg-transparent left-4 bottom-4">
        <div className="text-3xl text-green-400">{tag}</div>
        <div className="w-[90%]">{subline}</div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="bg-black w-screen px-14 flex justify-between items-center py-20">
      {/* Left Side - Text */}
      <div className="w-[40%] flex flex-col gap-6">
        {/* Headline */}
        <div className="text-7xl font-[Roboto] bg-gradient-to-r from-blue-400 via-green-400 to-indigo-400 inline-block text-transparent bg-clip-text">
          Lights On. Stage Set. <br /> Let the Show Begin!
        </div>

        {/* Subline */}
        <div className="flex flex-col text-lg gap-2 w-[90%]">
          <span className="text-white">
            <span className="font-semibold">Comedy, poetry, concerts</span>, and
            more — all happening near you.
          </span>
          <span className="italic text-gray-400">
            Your backstage pass to unforgettable nights.
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              redirect("/create-event");
            }}
            type="button"
            className="justify-start flex hover:bg-blue-400 text-white w-34 p-3 font-bold rounded-md text-center cursor-pointer bg-indigo-500"
          >
            Create Event
          </button>

          <button
            onClick={() => {
              redirect("/explore-events");
            }}
            type="button"
            className="justify-start flex hover:bg-blue-400 hover:text-white text-black w-36 p-3 font-bold rounded-md text-center cursor-pointer bg-white"
          >
            Explore Events
          </button>
        </div>
      </div>

      {/* Right Side - Images */}
      <div className="flex gap-5">
        <Image
          className="z-10 rounded-xl shadow-lg"
          width={400}
          src={Guitar}
          alt="guitar"
        />
        <Image
          className="-translate-y-12 rounded-xl shadow-lg"
          width={400}
          src={StandUp}
          alt="standup"
        />
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      id: 1,
      image: Feature1,
      tag: "Sports Event",
      subline:
        "Experience high-speed motorcycle racing with top riders competing on challenging tracks.",
    },
    {
      id: 2,
      image: Feature2,
      tag: "Circus Show",
      subline:
        "Witness gravity-defying stunts, mesmerizing jugglers, and a celebration of circus artistry.",
    },
    {
      id: 3,
      image: Feature3,
      tag: "Horror Night",
      subline:
        "Enter if you dare — haunted attractions, live scares, and screams all night long.",
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-12">
        <div className="text-5xl gap-3 flex flex-col text-center mb-10 text-blue-400 font-[Roboto]">
          <div>Explore our Diverse</div>
          <div>Event Categories</div>
        </div>

        <div className="text-lg w-[50%] text-center">
          From intimate elebrations to grant events, we offer a wide range of
          events to choose from. Browse music, sports, workshops and more.
        </div>
      </div>

      <div className="flex px-12 gap-6 justify-center mt-12">
        {features.map((feature) => (
          <Feature
            key={feature.id}
            image={feature.image}
            tag={feature.tag}
            subline={feature.subline}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
