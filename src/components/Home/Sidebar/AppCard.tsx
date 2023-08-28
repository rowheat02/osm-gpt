import { motion as m } from "framer-motion";
import githubLogo from "@/assets/icons/github-icon.png";
import noNameLogo from "@/assets/logos/osmgpt-noname.png";
import Image from "next/image";
import RunningSvg from "@/assets/animatingsvg/run";

export default function AppCard() {
  return (
    <m.div
      initial={{
        height: "100vh",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#F6F8FB",
        overflow: "hidden",
      }}
      animate={{
        position: "static",
        height: "30%",
      }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center gap-1 justify-center"
    >
      <div
        // initial={{ width: "fit", height: "35%", overflow: "hidden" }}
        // animate={{ width: "fit", height: "25%" }}
        // transition={{ duration: 0.5 }}
        className="image-cover w-fit h-[35%]"
      >
        <div
          // initial={{ transform: "translateX(100%)", opacity: 0 }}
          //   animate={{ transform: "translateX(0%)", opacity: 1 }}
          //   transition={{ duration: 0.5, delay: 0.2 }}
          className="image w-full h-full"
        >
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
              initial={{ fontSize: "6rem" }}
              animate={{ fontSize: "1.5rem" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[6rem] font-semibold leading-none"
            >
              OSM-GPT
            </m.p>
          </div>
        </m.div>
        <div className=" overflow-hidden h-fit">
          <m.p
            initial={{ fontSize: "1.5rem", fontWeight: "bold" }}
            animate={{ fontSize: ".8rem", fontWeight: "400" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-[1.5rem] font-semibold"
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
    </m.div>
  );
}
