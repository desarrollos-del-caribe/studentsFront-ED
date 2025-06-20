import { useState, useEffect } from 'react';
import { fetchCountries } from '../../services/api';
import type { CountriesResponse } from '../../types/AnalysisData';

const Countries: React.FC = () => {
  const [data, setData] = useState<CountriesResponse['data']['countries'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryData = await fetchCountries();
        setData(countryData.data.countries);
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
      <h2 className="text-xl font-semibold">Clasificación por Países</h2>
      <p>Número de países únicos: {data.valid_countries}</p>
      <h3 className="mt-4">Estudiantes por País (Top 10)</h3>
      <ul className="list-disc pl-5">
        {Object.entries(data.country_counts).map(([country, count]) => (
          <li key={country}>
            {country}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Countries;