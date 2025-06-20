import type { Dispatch, SetStateAction } from "react";

interface AnalysisCardProps {
  setSelectedAction: Dispatch<SetStateAction<string>>;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ setSelectedAction }) => {
  const analyses = [
    { id: 'cleaning', label: 'Limpieza de Datos' },
    { id: 'statistics', label: 'Estadísticas Descriptivas' },
    { id: 'age', label: 'Validación de Edades' },
    { id: 'countries', label: 'Clasificación por Países' },
    { id: 'outliers', label: 'Datos Atípicos' },
    { id: 'plots', label: 'Gráficos' },
    { id: 'linear_regression', label: 'Regresión Lineal' },
    { id: 'logistic_regression', label: 'Regresión Logística' },
    { id: 'correlation', label: 'Matriz de Correlación' },
    { id: 'decision_tree', label: 'Árbol de Decisión' },
    { id: 'anova', label: 'Análisis ANOVA' },
  ];

  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-semibold mb-4">Seleccionar Análisis</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {analyses.map((analysis) => (
          <button
            key={analysis.id}
            onClick={() => setSelectedAction(analysis.id)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {analysis.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalysisCard;