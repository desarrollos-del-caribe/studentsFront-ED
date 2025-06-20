import { useState, useEffect } from 'react';
import PlotDisplay from '../PlotDisplay';
import { fetchAgeValidation, fetchPlots } from '../../services/api';
import type { AgeValidationResponse, PlotsResponse } from '../../types/AnalysisData';

const AgeValidation: React.FC = () => {
  const [data, setData] = useState<AgeValidationResponse['data_age']['age_info'] | null>(null);
  const [plots, setPlots] = useState<PlotsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ageData, plotsData] = await Promise.all([
          fetchAgeValidation(),
          fetchPlots(),
        ]);
        setData(ageData.data_age.age_info);
        setPlots(plotsData.data);
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
  if (!data || !plots) return <div className="text-center text-gray-500">No hay datos disponibles</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold">Validación de Edades</h2>
      <p>Rango de edades: {data.min_age} - {data.max_age} años</p>
      <p>Edades fuera del rango (16-25): {data.invalid_ages}</p>
      <PlotDisplay src={plots.plots[0]} alt="Histograma de Edades" />
    </div>
  );
};

export default AgeValidation;