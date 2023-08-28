/* eslint-disable @next/next/no-img-element */
"use client";

import { Input } from "@/components/ui/input";
import MapContainer from "@/components/Maplibre/MapContainer";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useMapboxMap from "@/components/Maplibre/useMaplibreMap";
import React, { useEffect, useMemo, useRef, useState } from "react";
import GeojsonLayer from "@/components/Maplibre/GeojsonLayer";
import Generating from "@/assets/animatingsvg/generating";
import { Textarea } from "@/components/ui/textarea";
import {
  OverpassPayload,
  addLineBreaks,
  generateBboxFromOverpassPayload,
  getAllGeomTypes,
  getRandomDarkColor,
  getboundtext,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RunningSvg from "@/assets/animatingsvg/run";
import { Separator } from "@/components/ui/separator";

import { Toaster, toast } from "sonner";
import { ChevronLeftSquare, ChevronRightSquare, Play } from "lucide-react";
import { motion as m } from "framer-motion";
import AppCard from "./AppCard";

var osmtogeojson = require("@/lib/osmtogeojson");

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

let queryAbortController: AbortController;
let overpassAbortController: AbortController;

interface ISidebarProps {
  map: any;
  layers: layer[];
  setLayers: React.Dispatch<React.SetStateAction<layer[]>>;
}

export default function Sidebar({ layers, setLayers, map }: ISidebarProps) {
  const [queryState, setQueryState] = useState<querystates>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<tabs>("askgpt");

  const [extractedQuery, setExtractedQuery] = useState<null | queryresponse>(
    null
  );

  //   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const extractFeatures = async (userinput?: string) => {
    setQueryState("generating_query");
    if (queryAbortController) queryAbortController.abort();
    if (overpassAbortController) overpassAbortController.abort();
    queryAbortController = new AbortController();
    overpassAbortController = new AbortController();

    let respjson = {
      osmquery: "",
      query_name: "",
    };
    try {
      setExtractedQuery(null);

      if (activeTab === "askgpt") {
        const response = await fetch("api/query", {
          signal: queryAbortController.signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usertext: userinput }),
        });
        const err = new Error();

        if (response.status === 401) {
          err.name = "Invalid Api Key";
          err.cause = 401;
          throw err;
        }
        if (response.status === 429) {
          err.name = "Rate Limited";
          err.cause = 429;
          throw err;
        }

        const respJson = await response.json();
        setExtractedQuery({
          osmquery: addLineBreaks(respJson?.osmquery),
          query_name: respJson?.query_name,
        });
        respjson = {
          osmquery: addLineBreaks(respJson?.osmquery),
          query_name: respJson?.query_name,
        };
      } else {
        setExtractedQuery({
          osmquery: extractedQuery?.osmquery || "",
          query_name: userinput || "",
        });
        respjson = {
          osmquery: extractedQuery?.osmquery || "",
          query_name: userinput || "",
        };
      }
      setQueryState("extracting_from_osm");

      var bounds = map.getBounds();

      var boundtext = getboundtext(bounds);

      let overpassResponse = await fetch(
        "https://overpass-api.de/api/interpreter?",
        {
          signal: overpassAbortController.signal,
          method: "POST",
          body: ` 
          ${respjson?.osmquery
            ?.replaceAll("{{bbox}}", boundtext)
            .replace("[out:xml]", "[out:json]")} 
        `,
        }
      );
      const overpassrespjson: OverpassPayload = await overpassResponse.json();

      const bbox = generateBboxFromOverpassPayload(overpassrespjson);
      const toGeojson = { ...osmtogeojson(overpassrespjson) };

      const geomtypes: ContainingGeometries = getAllGeomTypes(toGeojson);

      if (toGeojson?.features.length === 0) {
        toast("Features not found");
      } else {
        setLayers([
          {
            geojson: toGeojson,
            name: respjson.query_name,
            color: getRandomDarkColor([...layers.map((lyr) => lyr.color)]),
            id: `${Date.now()}`,
            containingGeometries: geomtypes,
            bbox: bbox,
          },
          ...layers,
        ]);
      }
      setQueryState("extraction_done");
    } catch (e: any) {
      console.log(e, e?.message, "error");
      setQueryState("idle");

      if (e.name === "AbortError") return;

      if (e.name === "SyntaxError" && activeTab === "askgpt") {
        return toast(`Syntax error: ${e?.message || "2"}`, {
          action: {
            label: "Continute editing query",
            onClick: () => {
              inputRef.current!.value = respjson?.query_name;
              setActiveTab("manual");
            },
          },
        });
      }
      toast.error(e?.name + ": " + e?.message || "Something went wrong", {
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  };

  return (
    <div
      id="querybar"
      className={`h-full w-full bg-secondary flex flex-col items-center justify-between overflow-hidden bg-[#F6F8FB]`}
    >
      <AppCard />
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.4 } }}
        className="px-2 h-full flex items-end justify-end flex-col w-full"
      >
        {queryState === "generating_query" && (
          <div className="w-full my-2 flex flex-col items-center justify-center">
            <p>Generating query . . .</p>
            <Generating />
          </div>
        )}

        {(activeTab === "manual" || !["idle"].includes(queryState)) && (
          <div className="w-full my-2 flex flex-col items-center justify-center">
            <div className="w-full my-4 flex items-center justify-center">
              <Textarea
                placeholder="osm query"
                value={extractedQuery?.osmquery || ""}
                onChange={(e) =>
                  setExtractedQuery({
                    query_name: extractedQuery?.osmquery || "",
                    osmquery: e.target.value,
                  })
                }
                rows={7}
                className="bg-slate-600 text-white"
                disabled={activeTab !== "manual"}
              />
            </div>
            {queryState === "extracting_from_osm" && (
              <p className="animate-bounce">Fetching from Overpass . . .</p>
            )}
          </div>
        )}

        {activeTab === "manual" && (
          <label className="text-center self-start p-1 text-sm">
            Name of your query
          </label>
        )}
        <div className="w-full  ">
          <Input
            type="email"
            placeholder={
              activeTab === "askgpt" ? "eg: get all restaurants" : "query name"
            }
            ref={inputRef}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                inputRef?.current?.value !== ""
              ) {
                e.preventDefault();
                extractFeatures(inputRef.current?.value || "");
              }
            }}
          />
        </div>
        <Button
          variant={"default"}
          className={`my-2 w-full`}
          onClick={() => {
            if (inputRef?.current?.value !== "") {
              extractFeatures(inputRef.current?.value || "");
            } else {
              inputRef.current?.focus();
            }
          }}
        >
          {
            <RunningSvg
              className={`${
                ["idle", "extraction_done"].includes(queryState)
                  ? "opacity-0 w-[1px]"
                  : "opacity-100 w-[16px]"
              }`}
            />
          }
          RUN
        </Button>
        <Separator className="my-2" />
        <Tabs value={activeTab} className="w-full mt-4">
          <TabsList className="w-full">
            <TabsTrigger
              value="askgpt"
              className={`flex-1 ${
                activeTab === "askgpt" ? "border border-black" : ""
              }`}
              onClick={() => {
                setActiveTab("askgpt");
                inputRef.current!.value = "";
                setQueryState("idle");
                setExtractedQuery({ osmquery: "", query_name: "" });
              }}
            >
              Ask GPT
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className={`flex-1 ${
                activeTab === "manual" ? "border border-black" : ""
              }`}
              onClick={() => {
                setActiveTab("manual");
                setQueryState("idle");
                inputRef.current!.value = extractedQuery?.query_name || "";
              }}
            >
              Manual Query
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </m.div>
    </div>
  );
}
