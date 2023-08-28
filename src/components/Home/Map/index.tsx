"use client";
import MapContainer from "@/components/Maplibre/MapContainer";

import React, { useRef, useState } from "react";
import GeojsonLayer from "@/components/Maplibre/GeojsonLayer";

import { Toaster } from "sonner";
// import { ChevronLeftSquare, ChevronRightSquare } from "lucide-react";
import Popup from "@/components/Maplibre/popup";
import ReorderComponent from "@/app/LayersWithReorder";

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

interface IHomeMapProps {
  map: any;
  mapRef: any;
  maploaded: boolean;
  layers: layer[];
  setLayers: React.Dispatch<React.SetStateAction<layer[]>>;
}

export default function HomeMap({
  map,
  mapRef,
  maploaded,
  layers,
  setLayers,
}: IHomeMapProps) {
  console.log("🚀 ~ file: HomeMap index.tsx:58 ~ mapRef:", mapRef);
  return (
    <div className="flex h-screen w-full flex-row overflow-hidden">
      <Toaster richColors position="top-right" />
      <div className="absolute z-30 p-2">
        <ReorderComponent layers={layers} setLayers={setLayers} map={map} />
      </div>
      <div id="map-container" className="w-full relative">
        <MapContainer mapRef={mapRef} style={{ width: "100%", height: "100%" }}>
          {layers.map((layer, i) => {
            return (
              <GeojsonLayer
                key={`${layer.id}`}
                id={layer.id}
                geojson={layer?.geojson}
                color={layer.color}
                map={map}
                maploaded={maploaded}
                containingGeometries={layer.containingGeometries}
              />
            );
          })}
          <Popup map={map} />
        </MapContainer>
      </div>
    </div>
  );
}
