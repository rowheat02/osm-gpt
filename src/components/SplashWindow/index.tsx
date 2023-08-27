import { motion as m } from "framer-motion";
import githubLogo from "@/assets/icons/github-icon.png";
import background from "@/assets/logos/osmgpt-noname.png";
import noNameLogo from "@/assets/logos/osmgpt-noname.png";
import Image from "next/image";
import RunningSvg from "@/assets/animatingsvg/run";

export default function SplashWindow() {
  const title = "OSM-GPT";
  return (
    <div className="fixed top-0 left-0 z-20 bg-[#F6F8FB]  text-white w-screen h-screen flex flex-col items-center justify-center">
      <div className="image-cover w-fit h-[35%] overflow-hidden">
        <m.div
          initial={{ transform: "translateX(100%)", opacity: 0 }}
          animate={{ transform: "translateX(0%)", opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="image w-full h-full"
        >
          <Image
            src={noNameLogo}
            alt="osm gpt logo"
            className="w-full h-full object-contain"
          />
        </m.div>
      </div>
      <div className="content text-gray-700 text-center flex flex-col items-center justify-center">
        <div className="title flex items-center gap-1">
          {title.split("").map((item, index) => (
            <div key={index} className=" overflow-hidden h-fit">
              <m.p
                initial={{ transform: "translateX(100%)" }}
                animate={{ transform: "translateX(0%)" }}
                transition={{ duration: 0.5, delay: 0.25 * index }}
                key={index}
                className="text-[6rem] font-semibold leading-none"
              >
                {item}
              </m.p>
            </div>
          ))}
        </div>
        <div className=" overflow-hidden h-fit">
          <m.p
            initial={{ transform: "translateY(100%)" }}
            animate={{ transform: "translateY(0%)" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-[1.5rem] font-semibold"
          >
            Easily Discover OpenStreetMap&apos;s Treasures
          </m.p>
        </div>
        <RunningSvg className="opacity-100 w-[16px]" />
        <m.small exit={{ opacity: 0 }}>Just a moment please...</m.small>
        {/* <Image src={githubLogo} alt="github logo" /> */}
      </div>
    </div>
  );
}
