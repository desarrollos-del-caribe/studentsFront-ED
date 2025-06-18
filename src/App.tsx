import { useState, useEffect } from "react";
import AnalysisCard from "./components/AnalysisCard";
import PlotDisplay from "./components/PlotDisplay";
import GenericsRequests from "./api/GenericRequest";
import type { AnalysisData } from "./types/AnalysisData";

const App: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await GenericsRequests.Get("analyze");

      setData(response.data);
      setLoading(false);
    };

    fetchData().catch((err) => {
      setError("Error al cargar los datos: " + err.message);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        <span className="ml-4 text-gray-700">Cargando...</span>
      </div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-blue-500 p-10" />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Análisis de Adicción a Redes Sociales
        </h1>

        <AnalysisCard setSelectedAction={setSelectedAction} />

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedAction === "cleaning" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Limpieza de Datos</h2>
                <p>Total de datos nulos: {data.null_info.total_nulls}</p>
                <h3 className="mt-4">Datos nulos por columna:</h3>
                <ul>
                  {Object.entries(data.null_info.null_counts).map(
                    ([col, count]) => (
                      <li key={col}>
                        {col}: {count}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {selectedAction === "statistics" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">
                  Estadísticas Descriptivas
                </h2>
                {Object.entries(data.statistics).map(([col, stats]) => (
                  <div key={col}>
                    <h3>{col}</h3>
                    <ul>
                      {Object.entries(stats).map(([key, value]) => (
                        <li key={key}>
                          {key}: {value.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {selectedAction === "age" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Validación de Edades</h2>
                <p>
                  Rango de edades: {data.age_info.min_age} -{" "}
                  {data.age_info.max_age} años
                </p>
                <p>
                  Edades fuera del rango (16-25): {data.age_info.invalid_ages}
                </p>
                <PlotDisplay
                  src={data.plots.histogram}
                  alt="Histograma de Edades"
                />
              </div>
            )}

            {selectedAction === "countries" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">
                  Clasificación por Países
                </h2>
                <p>
                  Número de países únicos: {data.country_info.valid_countries}
                </p>
                <h3>Estudiantes por País (Top 10)</h3>
                <ul>
                  {Object.entries(data.country_info.country_counts).map(
                    ([country, count]) => (
                      <li key={country}>
                        {country}: {count}
                      </li>
                    )
                  )}
                </ul>
                <PlotDisplay
                  src={data.plots.country_plot}
                  alt="Gráfico por País"
                />
              </div>
            )}

            {selectedAction === "trimester" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">
                  Validación de Trimestre
                </h2>
                <p>
                  Datos atípicos (horas de uso diario &gt; 10):{" "}
                  {data.trimester_info.outliers}
                </p>
              </div>
            )}

            {selectedAction === "predictions" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">
                  Predicción de Conflictos
                </h2>
                <p>Probabilidad de conflictos altos por estado de relación:</p>
                <ul>
                  {Object.entries(data.prediction_summary).map(
                    ([status, prob]) => (
                      <li key={status}>
                        {status}: {prob.toFixed(2)}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {selectedAction === "decision_tree" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Árbol de Decisión</h2>
                <p>{data.tree_explanation}</p>
                <PlotDisplay
                  src={data.plots.decision_tree}
                  alt="Árbol de Decisión"
                />
              </div>
            )}

            {selectedAction === "clustering" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Clustering</h2>
                <p>Distribución de clusters:</p>
                <ul>
                  {Object.entries(data.cluster_info).map(([cluster, count]) => (
                    <li key={cluster}>
                      Cluster {cluster}: {count} estudiantes
                    </li>
                  ))}
                </ul>
                <PlotDisplay
                  src={data.plots.clustering_3d}
                  alt="Gráfico 3D de Clustering"
                />
              </div>
            )}

            {selectedAction === "line_plot" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Gráfico Lineal</h2>
                <PlotDisplay src={data.plots.line_plot} alt="Gráfico Lineal" />
              </div>
            )}

            {selectedAction === "3d_plot" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Gráfico 3D</h2>
                <PlotDisplay src={data.plots["3d_plot"]} alt="Gráfico 3D" />
              </div>
            )}

            {selectedAction === "boxplot" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Boxplot</h2>
                <PlotDisplay src={data.plots.boxplot} alt="Boxplot" />
              </div>
            )}

            {selectedAction === "heatmap" && (
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">
                  Mapa de Calor de Correlación
                </h2>
                <PlotDisplay src={data.plots.heatmap} alt="Mapa de Calor" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
