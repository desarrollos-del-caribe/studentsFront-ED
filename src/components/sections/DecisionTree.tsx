import { useState, useEffect } from 'react';
import { fetchDecisionTree } from '../../services/api';
import type { DecisionTreeData } from '../../types/AnalysisData';
import PlotDisplay from '../PlotDisplay';

const DecisionTree: React.FC = () => {
  const [data, setData] = useState<DecisionTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const treeData = await fetchDecisionTree();
        console.log('Respuesta de la API:', treeData);
        setData(treeData.data.decision_tree);
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
  if (!data || !data.tree_image) {
    return <div className="text-center text-gray-500">No hay imagen del árbol disponible</div>;
  }

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
      <PlotDisplay src={data.tree_image} alt="Visualización del Árbol de Decisión" />
    </div>
  );
};

export default DecisionTree;