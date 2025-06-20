import { useState, useEffect } from 'react';
import { fetchLogisticRegression } from '../../services/api';
import type { LogisticRegressionData } from '../../types/AnalysisData';

const LogisticRegression: React.FC = () => {
  const [data, setData] = useState<LogisticRegressionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regressionData = await fetchLogisticRegression();
        setData(regressionData.data.logistic_regression);
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
      <h2 className="text-xl font-semibold">Regresión Logística</h2>
      <p>Intercepto: {data.intercept.toFixed(2)}</p>
      <p>Precisión: {data.accuracy.toFixed(2)}</p>
      <h3 className="mt-4">Coeficientes:</h3>
      <ul className="list-disc pl-5">
        {Object.entries(data.coefficients).map(([key, value]) => (
          <li key={key}>
            {key.replace('coef_', '')}: {value.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogisticRegression;