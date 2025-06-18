import React from 'react';

interface PlotDisplayProps {
  src: string;
  alt: string;
}

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