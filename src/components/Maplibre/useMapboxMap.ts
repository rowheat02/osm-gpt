import { useEffect, useRef, useState } from "react";
import mapgl from "maplibre-gl";



function useMapboxMap(options: any) {
  const [map, setMap] = useState<any| null>(null);
  const [maploaded, setMaploaded] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  

  useEffect(() => {
    const opts = {
      container: mapRef.current,
      preserveDrawingBuffer: true,
      style: {
        version: 8,

        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution:
              "Sources :  &copy; OpenStreetMap Contributors",
            maxzoom: 18,
          },
          
        },
        // glyphs: 'fonts/{fontstack}/{range}.pbf',
        glyphs:
          "https://exposure-bipad-staging.naxa.com.np/static/fonts/{fontstack}/{range}.pbf",

        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            layout: {
              visibility: "visible",
            },
          },
          
        ],
      },
      ...options,
    };

    const mapInstance = new mapgl.Map(opts);
    mapInstance.addControl(new mapgl.NavigationControl());;

    mapInstance.on("load", () => {
      setMaploaded(true);
    });

    setMap(mapInstance);

    // mapInstance?.fitBounds([85.337039057704, 27.7077643255389, 85.3578457529013, 27.7269739052305]);
  }, [options]);

  return { map, mapRef, maploaded };
}

export default useMapboxMap;
