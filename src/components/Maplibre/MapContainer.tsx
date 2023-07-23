"use client";
import React, { ReactElement, ReactNode, RefObject } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapContainerProps {
  children: ReactNode;
  mapRef: RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

function MapContainer({
  mapRef,
  style = {},
  children,
}: MapContainerProps): ReactElement {
  const childrenArray = React.Children.toArray(children);

  return (
    <div id="main-map" style={{ ...style }} ref={mapRef}>
      {childrenArray.map((child) => child)}
    </div>
  );
}

export default MapContainer;
