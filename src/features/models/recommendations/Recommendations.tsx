import React from 'react';

interface Recommendation {
  text: string;
  severity: 'low' | 'medium' | 'high';
}

interface RecommendationsProps {
  additionalInfo?: string;
  message?: string;
  recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ message, recommendations }) => {
  const getColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'text-green-700 bg-green-100 border border-green-300';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border border-yellow-300';
      case 'high':
        return 'text-red-700 bg-red-100 border border-red-300';
      default:
        return 'text-gray-700 bg-gray-100 border border-gray-300';
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center w-full">
      <div className="w-full max-w-4xl p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Análisis y Recomendaciones
        </h3>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-center">
            {message}
          </div>
        )}

        {recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className={`p-3 rounded-md ${getColor(rec.severity)}`}
              >
                {rec.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No hay recomendaciones disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
