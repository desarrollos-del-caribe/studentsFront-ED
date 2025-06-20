import { useState, useEffect } from 'react';
import PlotDisplay from '../PlotDisplay';
import { fetchPlots } from '../../services/api';
import type { PlotsData } from '../../types/AnalysisData';

const Plots: React.FC = () => {
  const [data, setData] = useState<PlotsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plotsData = await fetchPlots();
        setData(plotsData.data);
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
      <h2 className="text-xl font-semibold">Gráficos</h2>
      <PlotDisplay src={data.plots[1]} alt="Dispersión de Uso de Redes Sociales" />
    </div>
  );
};

export default Plots;