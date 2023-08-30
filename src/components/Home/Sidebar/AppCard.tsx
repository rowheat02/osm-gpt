import { motion as m } from "framer-motion";
import githubLogo from "@/assets/icons/github-icon.png";
import noNameLogo from "@/assets/logos/osmgpt-noname.png";
import Image from "next/image";
import RunningSvg from "@/assets/animatingsvg/run";

export default function AppCard() {
  return (
    <div className="flex flex-col items-center gap-1 justify-center h-[30%]">
      <div className="image-cover w-fit h-[35%]">
        <div className="image w-full h-full">
          <Image
            src={noNameLogo}
            alt="osm gpt logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="content text-gray-700 text-center flex flex-col items-center justify-center">
        <m.div
          initial={{ gap: "4px" }}
          animate={{ gap: "0px" }}
          className="title flex items-center gap-1"
        >
          <div className="overflow-hidden h-fit">
            <m.p
              initial={{ scale: 1.75 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="font-semibold leading-none text-[1.5rem]"
            >
              OSM-GPT
            </m.p>
          </div>
        </m.div>
        <div className=" overflow-hidden h-fit">
          <m.p
            initial={{ scale: 1.75 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[.8rem] font-normal"
          >
            Easily Discover OpenStreetMap&apos;s Treasures
          </m.p>
        </div>
        <m.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          href="https://github.com/rowheat02/osm-gpt"
          target="_blank"
        >
          <Image src={githubLogo} alt="github image" width={25} height={25} />
        </m.a>
        <m.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, display: "hidden" }}
          //   className="loading"
        >
          <RunningSvg className="opacity-100 w-[16px]" />
        </m.div>
        <m.small animate={{ opacity: 0, display: "hidden" }}>
          Just a moment please...
        </m.small>
      </div>
    </div>
  );
}
