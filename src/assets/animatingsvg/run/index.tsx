import React from "react";
import "./index.css";

function RunningSvg({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-play ${className}`}
    >
      <polygon points="5 3 19 12 5 21 5 3" className="running-1" />
    </svg>
  );
}

export default RunningSvg;
