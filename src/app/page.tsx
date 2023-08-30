/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import SplashWindow from "@/components/SplashWindow";
import { motion as m } from "framer-motion";
import HomeMap from "@/components/Home/Map";
import Sidebar from "@/components/Home/Sidebar";
import useMapboxMap from "@/components/Maplibre/useMaplibreMap";
import { useIsLarge } from "@/hooks/useMediaQuery";
import { ChevronLeftSquare, ChevronRightSquare, Play } from "lucide-react";

export type querystates =
  | "idle"
  | "generating_query"
  | "extracting_from_osm"
  | "extraction_done";

export type tabs = "manual" | "askgpt";

export type queryresponse = {
  osmquery: string;
  query_name: string;
};

export type dynamicgeojson = {
  [key: string]: any;
};

export interface layer {
  name: string;
  geojson: dynamicgeojson;
  color: string;
  id: string;
  containingGeometries: {
    visibleOnMap: boolean;
    type: string;
  }[];
  bbox: number[];
}

export type ContainingGeometries = layer["containingGeometries"];

const mapopts = {
  center: [85.3652949, 27.7420354],
  zoom: 12,
  pitch: 0,
  maxzoom: 25,
};

export default function Home() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const isLarge = useIsLarge();
  useEffect(() => {
    if (isLarge) setSidebarOpen(true);
  }, [isLarge]);

  useEffect(() => {
    const timerInstance = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timerInstance);
  }, []);

  const { map, mapRef, maploaded } = useMapboxMap({
    ...mapopts,
    renderMap: !showSplash,
  });

  const [layers, setLayers] = useState<layer[]>([]);
  if (showSplash) return <SplashWindow />;

  return (
    <div className="w-screen h-screen flex relative">
      <>
        <m.div
          // initial={{ width: "0%" }}
          // animate={{ width: "75%" }}
          // transition={{ duration: 0.3 }}
          className={`map w-full ${
            sidebarOpen ? "w-0" : "w-full"
          } lg:w-3/4 h-screen overflow-hidden`}
        >
          <HomeMap
            map={map}
            mapRef={mapRef}
            maploaded={maploaded}
            layers={layers}
            setLayers={setLayers}
          />
        </m.div>
        <div className="w-fit  h-fit absolute top-2 right-2 cursor-pointer lg:hidden z-10">
          {sidebarOpen ? (
            <ChevronRightSquare
              width={30}
              height={30}
              onClick={() => setSidebarOpen((prev) => !prev)}
            />
          ) : (
            <ChevronLeftSquare
              width={30}
              height={30}
              onClick={() => setSidebarOpen((prev) => !prev)}
            />
          )}
        </div>
        {sidebarOpen && (
          <m.div
            initial={{ transform: "translateX(50%)", opacity: 0 }}
            animate={{ transform: "translateX(0%)", opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`sidebar bg-red-600  ${
              sidebarOpen ? "w-full" : "w-0"
            } lg:w-1/4 h-screen overflow-hidden relative`}
          >
            <Sidebar map={map} setLayers={setLayers} layers={layers} />
          </m.div>
        )}
      </>
    </div>
  );
}
