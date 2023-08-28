/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SplashWindow from "@/components/SplashWindow";
import { motion as m } from "framer-motion";
import HomeMap from "@/components/Home/Map";
import Sidebar from "@/components/Home/Sidebar";
import useMapboxMap from "@/components/Maplibre/useMaplibreMap";

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

  useEffect(() => {
    const timerInstance = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timerInstance);
  }, []);

  const { map, mapRef, maploaded } = useMapboxMap(mapopts);
  console.log("🚀 ~ file: page.tsx:61 ~ Home ~ mapRef:", mapRef);

  const [layers, setLayers] = useState<layer[]>([]);
  // const [mapRefrence, setMapRefrence] =
  //   useState<React.MutableRefObject<HTMLDivElement | null>>();
  // const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // useEffect(() => {
  //   if (!mapRef.current) return;
  //   setMapRefrence(mapRef);
  // }, [mapRef]);

  if (showSplash) return <SplashWindow />;

  return (
    <div className="w-screen h-screen flex">
      <m.div
        initial={{ width: "0%" }}
        animate={{ width: "75%" }}
        transition={{ duration: 0.6 }}
        className="map w-3/4 h-screen overflow-hidden"
      >
        <HomeMap
          map={map}
          mapRef={mapRef}
          maploaded={maploaded}
          layers={layers}
          setLayers={setLayers}
        />
      </m.div>
      <m.div
        initial={{ width: "100%" }}
        animate={{ width: "25%" }}
        transition={{ duration: 0.6 }}
        className="sidebar w-1/4 h-screen overflow-hidden"
      >
        <Sidebar map={map} setLayers={setLayers} layers={layers} />
      </m.div>
    </div>
  );
}
