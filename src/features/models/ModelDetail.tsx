import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ML_MODELS } from "../../shared/constants/mlModels";
import { ArrowLeft } from "lucide-react";
import ModelNoData from "./ModelNoData";
import { RenderIcon } from "../../shared/components";
import ModelLock from "./ModelLock";
import * as Models from "../../shared/services/model.services";
import type {
  UserFormData,
  ModelVisualizationData,
  ScatterDataPoint,
} from "../../shared/types/ml";

interface KMeansResponse {
  clusters: number;
  features_data: string[];
  label: string;
  points: ScatterDataPoint[];
}
interface TreeVisualizationResponse {
  label: string;
  target: string;
  tree_text: string;
}
import ModelData from "./ModelData";

export default function ModelDetail() {
  const { modelId } = useParams<{ modelId: string }>();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const model = ML_MODELS.find((m) => m.id === parseInt(modelId || "0"));
  const [haveData, setHaveData] = useState<boolean>(false);
  const [visualizations, setVisualizations] = useState<
    ModelVisualizationData[]
  >([]);

  useEffect(() => {
    if (localStorage.getItem("formCompleted") === "true") {
      setIsUnlocked(true);
    }
    const storedData = localStorage.getItem("userFormData");
    const formData = storedData
      ? (JSON.parse(storedData) as UserFormData)
      : null;

    if (!model) {
      console.error("Modelo no encontrado:", modelId);
    } else {
      switch (model.name) {
        case "Regresión Lineal": {
          async function fetchData() {
            const response1 = formData
              ? await Models.PostSleepPrediction(formData) : [undefined, undefined];

            if (response1 ) {
              setHaveData(true);
              console.log("Sleep Prediction:", response1);
              const visualizations: ModelVisualizationData[] = [
                {
                  title: "Predicción de Horas de Sueño",
                  type: "bar",
                  data: [
                    {
                      label: "Horas Predichas",
                      value: response1.predicted_sleep_hours,
                      color: "#4CAF50",
                    },
                  ],
                  width: 400,
                  height: 300,
                  xAxisLabel: "Métrica",
                  yAxisLabel: "Horas",
                },
              ];
              setVisualizations(visualizations);
            } else {
              setHaveData(false);
            }
          }

          fetchData();
          break;
        }

        case "Regresión Logística": {
          async function fetchData() {
            const [response1, response2] = formData
              ? await Promise.all([
                  Models.PostAcademicImpactPrediction(formData),
                  Models.PostAcademicRiskPrediction(formData),
                ])
              : [undefined, undefined];

            if (response1 || response2) {
              setHaveData(true);
              console.log("Academic Impact:", response1);
              console.log("Academic Risk:", response2);
              const visualizations: ModelVisualizationData[] = [];
              if (response1) {
                visualizations.push({
                  title: "Impacto Académico",
                  type: "bar",
                  data: [
                    {
                      label: response1.impact,
                      value: response1.probability * 100,
                      color: "#2196F3",
                    },
                  ],
                  width: 400,
                  height: 300,
                  xAxisLabel: "Impacto",
                  yAxisLabel: "Probabilidad (%)",
                });
              }
              if (response2) {
                visualizations.push({
                  title: "Riesgo Académico",
                  type: response2.graph_url ? "image" : "bar",
                  data: response2.graph_url || [
                    {
                      label: response2.risk,
                      value: response2.probability * 100,
                      color: "#F44336",
                    },
                  ],
                  width: 400,
                  height: 300,
                  xAxisLabel: "Riesgo",
                  yAxisLabel: "Probabilidad (%)",
                });
              }
              setVisualizations(visualizations);
            } else {
              setHaveData(false);
            }
          }

          fetchData();
          break;
        }

        case "K-Means Clustering": {
          async function fetchData() {
            const response = formData
              ? await Models.GetKMeansClusteringPrediction(formData)
              : undefined;

            if (response) {
              setHaveData(true);
              const kmeanResponse = response as KMeansResponse;
              console.log("K-Means Response:", kmeanResponse);

              const kmeansVisualizaciones: ModelVisualizationData[] = [
                {
                  title: "Distribución de Clusters",
                  type: "scatter",
                  data:
                    kmeanResponse.points ||
                    ([
                      // Datos de muestra con coordenadas 3D
                      { x: 2.5, y: 3.1, z: 1.8, cluster: 0 },
                      { x: 1.8, y: 2.9, z: 2.2, cluster: 0 },
                      { x: 2.2, y: 3.3, z: 1.5, cluster: 0 },
                      { x: 5.1, y: 4.8, z: 3.9, cluster: 1 },
                      { x: 4.9, y: 5.2, z: 4.1, cluster: 1 },
                      { x: 5.3, y: 4.6, z: 3.7, cluster: 1 },
                      { x: 8.2, y: 1.1, z: 6.8, cluster: 2 },
                      { x: 7.9, y: 1.4, z: 6.5, cluster: 2 },
                      { x: 8.5, y: 0.9, z: 7.1, cluster: 2 },
                      { x: 3.1, y: 6.8, z: 2.9, cluster: 3 },
                      { x: 2.8, y: 7.1, z: 3.2, cluster: 3 },
                      { x: 3.4, y: 6.5, z: 2.7, cluster: 3 },
                    ] as ScatterDataPoint[]),
                  width: 800,
                  height: 600,
                  xAxisLabel: "Componente Principal 1",
                  yAxisLabel: "Componente Principal 2",
                },
              ];

              setVisualizations(kmeansVisualizaciones);
            } else {
              setHaveData(false);
            }
          }

          fetchData();
          break;
        }

        case "Random Forest": {
          async function fetchData() {
            const response = formData
              ? await Models.PostSocialMediaAddictionRiskPrediction(formData)
              : undefined;

            if (response) {
              setHaveData(true);
              console.log("Social Media Addiction Risk:", response);
              const visualizations: ModelVisualizationData[] = [
                {
                  title: "Riesgo de Adicción a Redes Sociales",
                  type: response.graph_url ? "image" : "pie",
                  data: response.graph_url || [
                    { label: "Bajo", value: response.probabilities[0] * 100, color: "#4CAF50" },
                    { label: "Medio", value: response.probabilities[1] * 100, color: "#FFC107" },
                    { label: "Alto", value: response.probabilities[2] * 100, color: "#F44336" },
                  ],
                  width: 400,
                  height: 300,
                  xAxisLabel: "Nivel de Riesgo",
                  yAxisLabel: "Probabilidad (%)",
                },
              ];
              setVisualizations(visualizations);
            } else {
              setHaveData(false);
            }
          }

          fetchData();
          break;
        }

        case "Árboles de Decisión": {
          async function fetchData() {
            const response = formData
              ? await Models.GetTreeVisualizationPrediction(formData)
              : undefined;

            if (response) {
              setHaveData(true);
              console.log("Tree Visualization:", response);
            } else {
              setHaveData(false);
            }
          }

          fetchData();
          break;
        }

        default:
          setHaveData(false);
          console.warn("Modelo no reconocido:", model);
          break;
      }
    }
  }, [model, modelId]);

  return (
    <>
      {!isUnlocked && <ModelLock />}

      {isUnlocked && (
        <div className="bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Link>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-6">
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <RenderIcon
                      icon={model?.icon || "brain"}
                      className="h-16 w-16 text-blue-600"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {model?.name}
                    </h1>
                    <p className="text-gray-600 mt-2">{model?.description}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {model?.accuracy}% Precisión
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {model?.algorithm}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!haveData && <ModelNoData />}
            {haveData && (
              <ModelData
                visualizations={visualizations}
                title={model?.name || "Modelo"}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}