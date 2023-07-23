import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addLineBreaks(str: string) {
  return str.replaceAll(/;/g, ";\n");
}

export function getAllGeomTypes(geojson: {
  features: { geometry: { type: string } }[];
}) {
  const geomtypes = [];

  if (geojson?.features?.find((a: any) => a.geometry?.type === "Point")) {
    geomtypes.push({ type: "Point", visibleOnMap: true });
  }
  if (
    geojson?.features?.find((a: any) =>
      ["Polygon", "MultiPolygon"].includes(a.geometry?.type)
    )
  ) {
    geomtypes.push({ type: "Polygon", visibleOnMap: true });
  }
  if (
    geojson?.features?.find((a: any) =>
      ["LineString", "MultiLineString"].includes(a.geometry?.type)
    )
  ) {
    geomtypes.push({ type: "Line", visibleOnMap: true });
  }
  return geomtypes;
}

export function getboundtext(bounds: any) {
  return (
    "" +
    bounds.getSouthWest().lat +
    "," +
    bounds.getSouthWest().lng +
    "," +
    bounds.getNorthEast().lat +
    "," +
    bounds.getNorthEast().lng +
    ""
  );
}

// Function to calculate Euclidean distance between two RGB colors
function colorDistance(color1: string, color2: string): number {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const rDiff = r2 - r1;
  const gDiff = g2 - g1;
  const bDiff = b2 - b1;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Function to generate a random dark color different from the given reference colors
export function getRandomDarkColor(referenceColors: string[]): string {
  const similarityThreshold = 50; // Adjust the threshold as needed for similarity check
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Generate random values for red, green, and blue channels in the range of 0 to 127
    const red = Math.floor(Math.random() * 128);
    const green = Math.floor(Math.random() * 128);
    const blue = Math.floor(Math.random() * 128);

    // Convert the individual color components to hexadecimal strings
    const redHex = red.toString(16).padStart(2, "0");
    const greenHex = green.toString(16).padStart(2, "0");
    const blueHex = blue.toString(16).padStart(2, "0");

    // Combine the hexadecimal color components
    const generatedColor = `#${redHex}${greenHex}${blueHex}`;

    // Check if the generated color is different from all the reference colors
    const failedColor = referenceColors.find(
      (color) => colorDistance(color, generatedColor) < similarityThreshold
    );

    if (!failedColor) {
      return generatedColor;
    }
  }

  // If a different color couldn't be found within the allowed attempts, return the last generated color that failed the check
  return referenceColors[referenceColors.length - 1];
}
