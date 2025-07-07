import type {
  ModelVisualizationData,
  ScatterDataPoint,
  ChartDataPoint,
} from "../../shared/types/ml";
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterPlot,
  
} from "./charts";
import LinearRegressionChart from "./charts/LinearRegressionChart";

interface ModelDataProps {
  visualizations?: ModelVisualizationData[];
  title?: string;
}

const isScatterData = (
  data: ChartDataPoint[] | ScatterDataPoint[],
  chartType: string
): data is ScatterDataPoint[] => {
  if (!Array.isArray(data) || data.length === 0) return false;
  const hasXY = "x" in data[0] && "y" in data[0];
  // For 'scatter' type (K-Means), require 'cluster'; for 'linear', it's optional
  const hasCluster = "cluster" in data[0];
  return chartType === "linear" ? hasXY : hasXY && hasCluster;
};

// Función helper para verificar si es K-Means
const isKMeansCluster = (title: string): boolean => {
  return (
    title.toLowerCase().includes("cluster") ||
    title.toLowerCase().includes("k-means")
  );
};

export default function ModelData({
  visualizations = [],
  title = "Datos del Modelo",
}: ModelDataProps) {
  const renderChart = (visualization: ModelVisualizationData) => {
    console.log("Rendering chart for visualization:", visualization);
    switch (visualization.type) {
      case "bar":
        if (isScatterData(visualization.data, visualization.type)) {
          return <div>Tipo de datos incompatible para gráfico de barras</div>;
        }
        return (
          <BarChart
            key={visualization.title}
            data={visualization.data}
            width={visualization.width || 500}
            height={visualization.height || 350}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
          />
        );
      case "line":
        if (isScatterData(visualization.data, visualization.type)) {
          return <div>Tipo de datos incompatible para gráfico de líneas</div>;
        }
        return (
          <LineChart
            key={visualization.title}
            data={visualization.data}
            width={visualization.width || 500}
            height={visualization.height || 350}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
          />
        );
      case "pie":
        if (isScatterData(visualization.data, visualization.type)) {
          return <div>Tipo de datos incompatible para gráfico circular</div>;
        }
        return (
          <PieChart
            key={visualization.title}
            data={visualization.data}
            width={visualization.width || 400}
            height={visualization.height || 400}
          />
        );
      case "scatter":
        if (!isScatterData(visualization.data, visualization.type)) {
          return <div>Tipo de datos incompatible para scatter plot</div>;
        }
        return (
          <ScatterPlot
            key={visualization.title}
            data={visualization.data}
            width={visualization.width || 600}
            height={visualization.height || 400}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
            title={visualization.title}
          />
        );
      case "linear":
        if (!isScatterData(visualization.data, visualization.type) || !visualization.regressionLine) {
          return <div>Tipo de datos incompatible para gráfico de regresión lineal</div>;
        }
        return (
          <LinearRegressionChart
            key={visualization.title}
            data={visualization.data}
            regressionLine={visualization.regressionLine}
            width={visualization.width || 600}
            height={visualization.height || 400}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
            title={visualization.title}
          />
        );
      case "histogram":
        if (isScatterData(visualization.data, visualization.type)) {
          return <div>Tipo de datos incompatible para histograma</div>;
        }
        return (
          <BarChart
            key={visualization.title}
            data={visualization.data}
            width={visualization.width || 500}
            height={visualization.height || 350}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
          />
        );
      default:
        if (isScatterData(visualization.data, visualization.type)) {
          return <div>Tipo de gráfico no soportado</div>;
        }
        return (
          <BarChart
            key={visualization.title}
            data={visualization.data}
            width={visualization.width || 500}
            height={visualization.height || 350}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
          />
        );
    }
  };

  if (visualizations.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay datos para mostrar</p>
          <p className="text-gray-400 text-sm mt-2">
            Pasa datos de visualización al componente para ver gráficos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className="grid gap-6">
        {visualizations.map((visualization, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              {visualization.title}
            </h3>
            <div className="flex justify-center">
              {renderChart(visualization)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}