import { useState, useEffect } from 'react';
import { fetchCorrelation } from '../../services/api';
import type { CorrelationData } from '../../types/AnalysisData';

const Correlation: React.FC = () => {
  const [data, setData] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const correlationData = await fetchCorrelation();
        setData(correlationData.data.correlation_matrix);
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
  if (!data) return <div className="text-center text-gray-500">No hay datos disponibles</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold">Matriz de Correlación</h2>
      {Object.entries(data).map(([col, correlations]) => (
        <div key={col} className="mt-4">
          <h3 className="text-lg font-medium">{col}</h3>
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