/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SplashWindow from "@/components/SplashWindow";
import MainComponent from "@/components/MainComponent";

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

export default function Home() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  useEffect(() => {
    const timerInstance = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timerInstance);
  }, []);

  if (showSplash) return <SplashWindow />;

  return <MainComponent />;
}
