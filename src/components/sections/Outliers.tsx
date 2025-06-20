import { useState, useEffect } from 'react';
import { fetchOutliers } from '../../services/api';
import type { OutliersData } from '../../types/AnalysisData';

const Outliers: React.FC = () => {
  const [data, setData] = useState<OutliersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const outliersData = await fetchOutliers();
        setData(outliersData.data);
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
      <h2 className="text-xl font-semibold">Datos Atípicos</h2>
      <p>Datos atípicos en uso de redes sociales: {data.outliers}</p>
    </div>
  );
};

export default Outliers;