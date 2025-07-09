import type { JSX } from "react";
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
  LinearRegressionChart,
} from "./charts";
import { DecisionTree } from "./charts/DecisionTree";
import { SVMChart } from "./charts/SVMChart";
import Recommendations from "./recommendations/Recommendations";
import { FaBrain, FaChartLine, FaClock, FaExclamationTriangle, FaHeart, FaMobileAlt, FaUsers } from "react-icons/fa";

interface ModelDataProps {
  visualizations?: ModelVisualizationData[];
  title?: string;
}

const cardStyles: { [key: string]: { color: string; icon: JSX.Element } } = {
  'Impacto Académico': { color: 'bg-blue-100', icon: <FaBrain className="h-10 w-10 text-blue-600" /> },
  'Adicción': { color: 'bg-red-100', icon: <FaExclamationTriangle className="h-15 w-15 text-red-600" /> },
  'Conflictos': { color: 'bg-yellow-100', icon: <FaUsers className="h-15 w-15 text-yellow-600" /> },
  'Salud Mental': { color: 'bg-purple-100', icon: <FaHeart className="h-15 w-15 text-purple-600" /> },
  'Plataforma': { color: 'bg-green-100', icon: <FaMobileAlt className="h-10 w-10 text-green-600" /> },
  'Sueño': { color: 'bg-indigo-100', icon: <FaClock className="h-15 w-15 text-indigo-600" /> },
  'Uso': { color: 'bg-teal-100', icon: <FaChartLine className="h-10 w-10 text-teal-600" /> },
};

const isScatterData = (
  data: ChartDataPoint[] | ScatterDataPoint[] | string
): data is ScatterDataPoint[] => {
  return (
    typeof data !== "string" &&
    data.length > 0 &&
    "x" in data[0] &&
    "y" in data[0] &&
    "cluster" in data[0]
  );
};

const isLogisticOrSVMData = (
  data:
    | ChartDataPoint[]
    | ScatterDataPoint[]
    | string
    | { datasetPoints: ChartDataPoint[]; userPoint: { x: number; y: number } }
): data is {
  datasetPoints: ChartDataPoint[];
  userPoint: { x: number; y: number };
} => {
  return (
    typeof data !== "string" &&
    !Array.isArray(data) &&
    "datasetPoints" in data &&
    "userPoint" in data
  );
};

export default function ModelData({
  visualizations = [],
  title = "Datos del Modelo",
}: ModelDataProps) {
  const renderChart = (visualization: ModelVisualizationData) => {
    switch (visualization.type) {
      case "bar":
        if (
          typeof visualization.data === "string" ||
          isScatterData(visualization.data)
        ) {
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
        if (
          typeof visualization.data === "string" ||
          isScatterData(visualization.data)
        ) {
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
        if (
          typeof visualization.data === "string" ||
          isScatterData(visualization.data)
        ) {
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
      case "linear":
        console.log(
          "Rendering linear regression chart with data:",
          visualization
        );
        if (
          typeof visualization.data === "string" ||
          !Array.isArray(visualization.data) ||
          !visualization.regressionLine
        ) {
          return <div>Tipo de datos incompatible para regresión lineal</div>;
        }
        return (
          <>
          <LinearRegressionChart
            key={visualization.title}
            data={visualization.data as ScatterDataPoint[]}
            regressionLine={visualization.regressionLine}
            width={visualization.width || 600}
            height={visualization.height || 400}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
            title={visualization.title}
            />
      </>
        );
        case "scatter":
          console.log("Rendering scatter plot with data:", visualization);
          if (
            typeof visualization.data === "string" ||
            !isScatterData(visualization.data)
          ) {
            return <div>Tipo de datos incompatible para scatter plot</div>;
          }
          // Identificar el user_point (punto con label "Tu Predicción")
          const userPoint = visualization.data.find(
            (point) => point.label === "Tu Predicción"
          );
          return (
            <ScatterPlot
              key={visualization.title}
              data={visualization.data.map((point) => ({
                ...point,
                cluster: point.cluster ?? 0,
              }))}
              userPoint={userPoint} 
              width={visualization.width || 600}
              height={visualization.height || 400}
              xAxisLabel={visualization.xAxisLabel}
              yAxisLabel={visualization.yAxisLabel}
              title={visualization.title}
              isClusteringModel={visualization.isClusteringModel || false}
            />
          );
      case "svm":
        if (!isLogisticOrSVMData(visualization.data)) {
          return <div>Tipo de datos incompatible para gráfico SVM</div>;
        }
        return (
          <SVMChart
            key={visualization.title}
            datasetPoints={visualization.data.datasetPoints}
            userPoint={visualization.data.userPoint}
            width={visualization.width || 600}
            height={visualization.height || 400}
            xAxisLabel={visualization.xAxisLabel}
            yAxisLabel={visualization.yAxisLabel}
          />
        );
        case "tree":
          if (typeof visualization.data !== "string" || !visualization.data.trim()) {
            return (
              <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
                <div className="text-red-600 font-semibold text-lg mb-4">
                  Error al mostrar el análisis
                </div>
                <div className="text-gray-600">
                  Los datos del análisis no son válidos o están vacíos.
                </div>
              </div>
            );
          }
          return <DecisionTree treeText={visualization.data} />;
      case "histogram":
        if (
          typeof visualization.data === "string" ||
          isScatterData(visualization.data)
        ) {
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
        case "text":
          return (
            <div
              className={`p-4 rounded-lg flex items-center space-x-7 ${
                cardStyles[visualization.title]?.color || 'bg-gray-100'
              }`}
              style={{
                width: visualization.width || 300,
                height: visualization.height || 200,
              }}
            >
              {cardStyles[visualization.title]?.icon}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  {visualization.title}
                </h4>
                <div className="text-gray-700 text-sm">
                  {visualization.additionalInfo || 'Sin información adicional'}
                </div>
              </div>
            </div>
          );
      default:
        if (
          typeof visualization.data === "string" ||
          isScatterData(visualization.data)
        ) {
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

  const textVisualizations = visualizations.filter(v => v.type === 'text');
  const otherVisualizations = visualizations.filter(v => v.type !== 'text');

  
  return (
    <div className="rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>

      <div className="grid gap-6">
        {otherVisualizations.map((visualization, index) => (
          <div key={index} className="p-4 rounded-lg">
            <div className="flex justify-center">
              {renderChart(visualization)}
            </div>

            {visualization.recommendations &&
              visualization.recommendations.length > 0 && (
                <Recommendations
                  message={visualization.message}
                  additionalInfo={visualization.additionalInfo}
                  recommendations={visualization.recommendations}
                />
            )}
          </div>
        ))}

        {textVisualizations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {textVisualizations.map((visualization, index) => (
              <div key={`text-${index}`} className="flex rounded-lg justify-center">
                {renderChart(visualization)}

                {visualization.recommendations &&
                  visualization.recommendations.length > 0 && (
                    <Recommendations
                      message={visualization.message}
                      additionalInfo={visualization.additionalInfo}
                      recommendations={visualization.recommendations}
                    />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
}
