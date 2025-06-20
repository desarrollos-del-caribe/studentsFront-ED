import { useState, useEffect } from 'react';
import { fetchNullInfo } from '../../services/api';
import type { NullInfo } from '../../types/AnalysisData';

const Cleaning: React.FC = () => {
  const [data, setData] = useState<NullInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nullData = await fetchNullInfo();
        setData(nullData.data.count);
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
      <h2 className="text-xl font-semibold">Limpieza de Datos</h2>
      <p>Total de datos nulos: {data.total_nulls}</p>
      <h3 className="mt-4">Datos nulos por columna:</h3>
      <ul className="list-disc pl-5">
        {Object.entries(data.null_counts).map(([col, count]) => (
          <li key={col}>
            {col}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cleaning;