/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ContainingGeometries, dynamicgeojson } from "@/app/page";
import React, { useEffect } from "react";

type geojsonlayertype = {
  map: any;
  maploaded: boolean;
  id: string;
  geojson: dynamicgeojson;
  color: string;
  containingGeometries: ContainingGeometries;
};

function GeojsonLayer({
  map,
  maploaded,
  id,
  geojson,
  color,
  containingGeometries,
}: geojsonlayertype) {
  useEffect(() => {
    if (!map || !geojson) return;

    if (maploaded && !map.getSource(`${id}-source`)) {
      map?.addSource(`${id}-source`, {
        type: "geojson",
        data: geojson,
      });
    }

    if (!map?.getLayer(`${id}-Polygon`) && maploaded) {
      map.addLayer({
        id: `${id}-Polygon`,
        type: "fill",
        source: `${id}-source`,
        paint: {
          "fill-color": color,
          "fill-opacity": 1,
        },
        filter: [
          "match",
          ["geometry-type"],
          ["Polygon", "MultiPolygon"],
          true,
          false,
        ],
      });
    }
    if (!map?.getLayer(`${id}-Line`) && maploaded) {
      map.addLayer({
        id: `${id}-Line`,
        type: "line",
        source: `${id}-source`,
        paint: {
          "line-color": color,
          "line-width": 4,
        },
        filter: [
          "match",
          ["geometry-type"],
          ["LineString", "MultiLineString"],
          true,
          false,
        ],
      });
    }
    if (!map?.getLayer(`${id}-Point`) && maploaded) {
      map.addLayer({
        id: `${id}-Point`,
        type: "circle",
        source: `${id}-source`,
        paint: {
          "circle-radius": 8,
          "circle-color": color,
          "circle-opacity": 0.9,
          "circle-stroke-color": "white",
          "circle-stroke-width": 1.5,
        },
        filter: ["==", "$type", "Point"],
      });
    }

    map.on("mouseenter", `${id}-Point`, () => {
      console.log("apo", id);
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", `${id}-Point`, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", `${id}-Line`, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", `${id}-Line`, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", `${id}-Polygon`, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", `${id}-Polygon`, () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      if (map.getLayer(`${id}-Point`)) {
        map.removeLayer(`${id}-Point`);
      }
      if (map.getLayer(`${id}-Polygon`)) {
        map.removeLayer(`${id}-Polygon`);
      }
      if (map.getLayer(`${id}-Line`)) {
        map.removeLayer(`${id}-Line`);
      }

      if (map.getSource(`${id}-source`)) {
        map?.removeSource(`${id}-source`);
      }
    };
  }, [map, maploaded, geojson, id]);

  useEffect(() => {
    if (!map) return;
    [
      { type: "Point", proptochange: "circle-color" },
      { type: "Line", proptochange: "line-color" },
      { type: "Polygon", proptochange: "fill-color" },
    ].forEach((a) => {
      map?.setPaintProperty(`${id}-${a.type}`, a.proptochange, color);
    });
  }, [map, color]);

  useEffect(() => {
    if (!map) return;
    containingGeometries.forEach((a) => {
      map?.setLayoutProperty(
        `${id}-${a.type}`,
        "visibility",
        a.visibleOnMap ? "visible" : "none"
      );
    });
  }, [map, containingGeometries]);

  return null;
}

export default GeojsonLayer;
