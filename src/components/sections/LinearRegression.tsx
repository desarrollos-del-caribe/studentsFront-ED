import { useState, useEffect } from 'react';
import { fetchLinearRegression } from '../../services/api';
import type { LinearRegressionData } from '../../types/AnalysisData';
import PlotDisplay from '../PlotDisplay';

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
      <h2 className="text-xl font-semibold mb-4">Regresión Lineal</h2>
      <p><strong>Intercepto:</strong> {data.intercept.toFixed(2)}</p>
      <p><strong>R² Score:</strong> {data.r2_score.toFixed(2)}</p>
      <h3 className="mt-4 font-semibold">Coeficientes:</h3>
      <ul className="list-disc pl-5 mb-4">
        {Object.entries(data.coefficients).map(([key, value]) => (
          <li key={key}>
            {key.replace('coef_', '')}: {value.toFixed(2)}
          </li>
        ))}
      </ul>
      <h3 className="mt-4 font-semibold">Visualización de la Regresión:</h3>
      {data.plot_image ? (
        <PlotDisplay src={data.plot_image} alt="Gráfico de Regresión Lineal" />
      ) : (
        <p className="text-gray-500">No hay gráfico disponible</p>
      )}
    </div>
  );
};

export default LinearRegression;