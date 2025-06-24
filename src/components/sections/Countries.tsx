import { useState, useEffect } from "react";
import { fetchCountries } from "../../services/api";
import type { CountriesResponse } from "../../types/AnalysisData";
import PlotDisplay from "../PlotDisplay";
const Countries: React.FC = () => {
  const [data, setData] = useState<
    CountriesResponse["data"]["countries"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryData = await fetchCountries();
        console.log(countryData);
        setData(countryData.data.countries);
      } catch (err) {
        setError((err as Error).message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!data)
    return (
      <div className="text-center text-gray-500">No hay datos disponibles</div>
    );

  // Ordenar países por conteo (Top 10)
  const sortedCountries = Object.entries(data.country_counts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Clasificación por Países</h2>
      <p>
        <strong>Número de países únicos:</strong> {data.valid_countries}
      </p>
      <h3 className="mt-4 font-semibold">Estudiantes por País (Top 10):</h3>
      <ul className="list-disc pl-5 mb-4">
        {sortedCountries.map(([country, count]) => (
          <li key={country}>
            {country}: {count}
          </li>
        ))}
      </ul>
      <h3 className="mt-4 font-semibold">Gráfico de Países:</h3>
      {data.graph ? (
        <PlotDisplay src={data.graph} alt="Gráfico de Países" />
      ) : (
        <p className="text-gray-500">No hay gráfico disponible</p>
      )}
      <h3 className="mt-4 font-semibold">Asignación de Clusters por País:</h3>
      {data.cluster_assignments &&
      Object.keys(data.cluster_assignments).length > 0 ? (
        <ul className="list-disc pl-5">
          {Object.entries(data.cluster_assignments).map(
            ([country, cluster]) => (
              <li key={country}>
                {country}: Cluster {cluster}
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="text-gray-500">
          No hay asignaciones de clusters disponibles
        </p>
      )}
    </div>
  );
};

export default Countries;
