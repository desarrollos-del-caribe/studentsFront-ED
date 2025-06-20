import { useState, useEffect } from 'react';
import { fetchAnova } from '../../services/api';
import type { AnovaData } from '../../types/AnalysisData';

const Anova: React.FC = () => {
  const [data, setData] = useState<AnovaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const anovaData = await fetchAnova();
        setData(anovaData.data.anova);
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
      <h2 className="text-xl font-semibold">Análisis ANOVA</h2>
      <p>Estadístico F: {data.f_statistic.toFixed(2)}</p>
      <p>Valor p: {data.p_value.toFixed(4)}</p>
    </div>
  );
};

export default Anova;