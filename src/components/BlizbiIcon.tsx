import React from "react";
import blizbiLogo from "../assets/blizbi-yellow.svg";

interface BlizbiIconProps {
  size?: number;
  color?: "yellow" | "orange" | "white" | "black"; // Add more as needed
  className?: string;
}

export const BlizbiIcon: React.FC<BlizbiIconProps> = ({
  size = 24,
  color, // No default - must be specified
  className = "",
}) => {
  const colorFilters = {
    yellow:
      "brightness(0) saturate(100%) invert(92%) sepia(90%) saturate(1000%) hue-rotate(0deg)",
    orange:
      "brightness(0) saturate(100%) invert(65%) sepia(30%) saturate(16000%) hue-rotate(5deg)",
    white: "brightness(0) invert(1)",
    black: "brightness(0) invert(0)",
  };

  return (

    <img
      src={blizbiLogo}
      alt="Blizbi"
      className={className}
      style={{
        width: "auto",
        height: `${size}px`,
        filter: color ? colorFilters[color] : undefined,
      }}
    />

   
  );
};
