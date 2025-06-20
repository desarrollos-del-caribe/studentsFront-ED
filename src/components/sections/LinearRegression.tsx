import { useState, useEffect } from 'react';
import { fetchLinearRegression } from '../../services/api';
import type { LinearRegressionData } from '../../types/AnalysisData';

const LinearRegression: React.FC = () => {
  const [data, setData] = useState<LinearRegressionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regressionData = await fetchLinearRegression();
        setData(regressionData.data.linear_regression);
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
      <h2 className="text-xl font-semibold">Regresión Lineal</h2>
      <p>Intercepto: {data.intercept.toFixed(2)}</p>
      <p>R² Score: {data.r2_score.toFixed(2)}</p>
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

export default LinearRegression;