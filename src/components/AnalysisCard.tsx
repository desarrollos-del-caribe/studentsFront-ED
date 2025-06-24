interface AnalysisCardProps {
  setSelectedAction: (action: string) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ setSelectedAction }) => {
  const analyses = [
    { id: "cleaning", label: "Limpieza de Datos" },
    { id: "statistics", label: "Estadísticas Descriptivas" },
    { id: "age", label: "Validación de Edades" },
    { id: "countries", label: "Clasificación por Países" },
    { id: "outliers", label: "Datos Atípicos" },
    { id: "plots", label: "Grafica Uso de Redes Sociales vs Edad" },
    { id: "linear_regression", label: "Regresión Lineal" },
    { id: "logistic_regression", label: "Regresión Logística" },
    { id: "correlation", label: "Matriz de Correlación" },
    { id: "decision_tree", label: "Árbol de Decisión" },
  ];

  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-semibold mb-4">Seleccionar Análisis</h2>
      <select
        className="p-2 border border-blue-500 rounded w-full"
        onChange={(e) => setSelectedAction(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Seleccione un análisis
        </option>
        {analyses.map((analysis) => (
          <option key={analysis.id} value={analysis.id}>
            {analysis.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AnalysisCard;
