import { useState, useEffect } from 'react';
import { fetchDecisionTree } from '../../services/api';
import type { DecisionTreeData } from '../../types/AnalysisData';

const DecisionTree: React.FC = () => {
  const [data, setData] = useState<DecisionTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const treeData = await fetchDecisionTree();
        console.log('Respuesta de la API:', treeData); // Depuración
        setData(treeData.data.decision_tree);
      } catch (err) {
        setError((err as Error).message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageError = () => {
    console.error('Error al cargar la imagen:', data?.tree_image); // Depuración
    setImageError(true);
  };

  if (loading) return <div className="text-center text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!data) return <div className="text-center text-gray-500">No hay datos disponibles</div>;

  const imageUrl = `${data.tree_image}?t=${new Date().getTime()}`;
  console.log('Intentando cargar imagen desde:', imageUrl); // Depuración

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Árbol de Decisión</h2>
      <p><strong>Precisión:</strong> {data.accuracy.toFixed(2)}</p>
      <h3 className="mt-4 font-semibold">Importancia de Características:</h3>
      <ul className="list-disc pl-5 mb-4">
        {Object.entries(data.feature_importance).map(([key, value]) => (
          <li key={key}>
            {key.replace('importance_', '')}: {value.toFixed(2)}
          </li>
        ))}
      </ul>
      <h3 className="mt-4 font-semibold">Visualización del Árbol:</h3>
      {imageError ? (
        <div className="text-center text-red-500">
          Error al cargar la imagen del árbol. Verifique que el archivo exista en el servidor.
          <p>URL intentada: {imageUrl}</p>
        </div>
      ) : (
        <div className="overflow-auto max-h-[70vh] border border-gray-200 rounded">
          <img
            src={imageUrl}
            alt="Árbol de Decisión"
            className="w-full h-auto object-contain"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onError={handleImageError}
          />
        </div>
      )}
    </div>
  );
};

export default DecisionTree;