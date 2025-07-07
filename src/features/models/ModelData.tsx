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

interface ModelDataProps {
  visualizations?: ModelVisualizationData[];
  title?: string;
}

const isScatterData = (
  data: ChartDataPoint[] | ScatterDataPoint[]
): data is ScatterDataPoint[] => {
  return (
    data.length > 0 && "x" in data[0] && "y" in data[0] && "cluster" in data[0]
  );
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
    switch (visualization.type) {
      case "bar":
        if (isScatterData(visualization.data)) {
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
        if (isScatterData(visualization.data)) {
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
        if (isScatterData(visualization.data)) {
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
        console.log("Rendering scatter plot with data:", visualization);
        if (!isScatterData(visualization.data)) {
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
        // Podrías implementar Histogram más tarde
        if (isScatterData(visualization.data)) {
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
        if (isScatterData(visualization.data)) {
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>

      <div className="gridgap-6">
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