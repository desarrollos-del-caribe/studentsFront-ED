import { useState, useEffect } from 'react';
import { fetchCorrelation } from '../../services/api';
import type { CorrelationResponse } from '../../types/AnalysisData';
import PlotDisplay from '../PlotDisplay';

const Correlation: React.FC = () => {
  const [data, setData] = useState<CorrelationResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const correlationData = await fetchCorrelation();
        setData(correlationData.data);
      } catch (err) {
        setError((err as Error).message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!data || !data.heatmap_image) {
    return <div className="text-center text-gray-500">No hay imagen de correlación disponible</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Matriz de Correlación</h2>
      <h3 className="mt-4 font-semibold">Mapa de Calor de Correlación:</h3>
      <PlotDisplay src={data.heatmap_image} alt="Mapa de Calor de Correlación" />
      <h3 className="mt-6 font-semibold">Valores de Correlación:</h3>
      {Object.entries(data.correlation_matrix).map(([col, correlations]) => (
        <div key={col} className="mt-4">
          <h4 className="text-lg font-medium">{col}</h4>
          <ul className="list-disc pl-5">
            {Object.entries(correlations).map(([key, value]) => (
              <li key={key}>
                {key}: {value.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Correlation;