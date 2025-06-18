import React from "react";
import type { PlotDisplayProps } from "../types/PlotDisplayProps";

const PlotDisplay: React.FC<PlotDisplayProps> = ({ src, alt }) => {
  return (
    <div className="mt-4">
      <img
        src={`http://localhost:5000${src}`}
        alt={alt}
        className="w-full h-auto rounded"
      />
    </div>
  );
};

export default PlotDisplay;
