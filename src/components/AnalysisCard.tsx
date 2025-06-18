import React from 'react';

interface AnalysisCardProps {
  setSelectedAction: (action: string) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ setSelectedAction }) => {
  const actions = [
    { value: 'cleaning', label: 'Limpieza de Datos' },
    { value: 'statistics', label: 'Estadísticas Descriptivas' },
    { value: 'age', label: 'Validación de Edades' },
    { value: 'countries', label: 'Clasificación por Países' },
    { value: 'trimester', label: 'Validación de Trimestre' },
    { value: 'predictions', label: 'Predicción de Conflictos' },
    { value: 'decision_tree', label: 'Árbol de Decisión' },
    { value: 'clustering', label: 'Clustering' },
    { value: 'line_plot', label: 'Gráfico Lineal' },
    { value: '3d_plot', label: 'Gráfico 3D' },
    { value: 'boxplot', label: 'Boxplot' },
    { value: 'heatmap', label: 'Mapa de Calor de Correlación' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAction(e.target.value);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Seleccionar Análisis</h2>
      <select
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
      >
        <option value="">Seleccione una opción</option>
        {actions.map(action => (
          <option key={action.value} value={action.value}>
            {action.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AnalysisCard;