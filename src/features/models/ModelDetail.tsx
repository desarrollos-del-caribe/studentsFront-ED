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

interface SleepPredictionResponse {
  predicted_sleep_hours_per_night: number;
  dataset_stats: {
    avg_social_media_usage: number;
    avg_sleep_hours_per_night: number;
  };
  message: string;
  sleep_classification: string;
  scatter_points?: ScatterDataPoint[];
  regression_line?: { slope: number; intercept: number };
}

interface AcademicResponse {
  impact?: string;
  risk?: string;
  probability: number;
  graph_url?: string;
  academic_impact_classification?: string;
  affects_academic_performance?: number;
  dataset_points?: Array<{
    label: number;
    x: number;
    y: number;
  }>;
  user_point?: {
    x: number;
    y: number;
  };
}

interface SocialMediaResponse {
  probabilities: {
    Adicción: number;
    "No adicción": number;
  };
  risk: string;
  graph_data?: {
    label: string;
    x: string[];
    y: number[];
  };
  graph_url?: string;
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
            const response = formData
              ? await Models.PostSleepPrediction(formData)
              : undefined;

            const sleepResponse = response as
              | SleepPredictionResponse
              | undefined;

            if (sleepResponse) {
              setHaveData(true);
              console.log("Sleep Prediction:", sleepResponse);
              const scatterPoints: ScatterDataPoint[] =
                sleepResponse.scatter_points || [
                  { x: 1, y: 8.5 },
                  { x: 2, y: 8.2 },
                  { x: 3, y: 7.8 },
                  { x: 4, y: 7.5 },
                  { x: 5, y: 7.0 },
                  { x: 6, y: 6.8 },
                  { x: 7, y: 6.5 },
                  { x: 8, y: 6.2 },
                  { x: 9, y: 5.8 },
                  { x: 10, y: 5.5 },
                ];
              const userPoint: ScatterDataPoint = {
                x: formData?.social_media_usage || 5,
                y: sleepResponse.predicted_sleep_hours_per_night,
                label: "Tu Predicción",
              };

              const visualizations: ModelVisualizationData[] = [
                {
                  title: "Regresión Lineal: Uso de Redes vs Sueño",
                  type: "linear",
                  data: [...scatterPoints, userPoint],
                  regressionLine: sleepResponse.regression_line || {
                    slope: -0.3,
                    intercept: 9.0,
                  },
                  width: 600,
                  height: 400,
                  xAxisLabel: "Horas de Uso de Redes Sociales",
                  yAxisLabel: "Horas de Sueño por Noche",
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

            const academicImpact = response1 as AcademicResponse | undefined;
            const academicRisk = response2 as AcademicResponse | undefined;

            if (academicImpact || academicRisk) {
              setHaveData(true);
              console.log("Academic Impact:", academicImpact);
              console.log("Academic Risk:", academicRisk);
              const visualizations: ModelVisualizationData[] = [];

              if (academicImpact) {
                // Si hay dataset_points, crear visualización con puntos
                if (
                  academicImpact.dataset_points &&
                  academicImpact.user_point
                ) {
                  // Separar puntos por etiqueta
                  const noAffectsPoints = academicImpact.dataset_points
                    .filter((point) => point.label === 0)
                    .map((point) => ({
                      x: point.x,
                      y: point.y,
                      cluster: 0,
                      label: "No Afecta",
                    }));

                  const affectsPoints = academicImpact.dataset_points
                    .filter((point) => point.label === 1)
                    .map((point) => ({
                      x: point.x,
                      y: point.y,
                      cluster: 1,
                      label: "Afecta",
                    }));

                  // Punto del usuario
                  const userPoint = {
                    x: academicImpact.user_point.x,
                    y: academicImpact.user_point.y,
                    cluster: academicImpact.affects_academic_performance || 0,
                    label: "Tu Predicción",
                  };

                  const allPoints = [
                    ...noAffectsPoints,
                    ...affectsPoints,
                    userPoint,
                  ];

                  visualizations.push({
                    title: "Regresión Logística: Impacto Académico",
                    type: "scatter",
                    data: allPoints,
                    width: 700,
                    height: 500,
                    xAxisLabel: "Horas de Uso de Redes Sociales",
                    yAxisLabel: "Horas de Sueño por Noche",
                    description:
                      academicImpact.academic_impact_classification ||
                      "Análisis del impacto académico basado en patrones de uso de redes sociales y sueño.",
                    additionalInfo: `Predicción: ${academicImpact.affects_academic_performance === 0 ? "No afecta tu rendimiento académico" : "Podría afectar tu rendimiento académico"} (${(academicImpact.probability * 100).toFixed(1)}% confianza)`,
                  });
                } else {
                  // Visualización de barras original si no hay dataset_points
                  visualizations.push({
                    title: "Impacto Académico",
                    type: "bar",
                    data: [
                      {
                        label: academicImpact.impact || "Sin impacto",
                        value: academicImpact.probability * 100,
                        color: "#2196F3",
                      },
                    ],
                    width: 400,
                    height: 300,
                    xAxisLabel: "Impacto",
                    yAxisLabel: "Probabilidad (%)",
                  });
                }
              }

              if (academicRisk) {
                visualizations.push({
                  title: "Riesgo Académico",
                  type: "bar",
                  data: [
                    {
                      label: academicRisk.risk || "Sin riesgo",
                      value: academicRisk.probability * 100,
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
                  data: kmeanResponse.points,
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

            const socialMediaResponse = response as
              | SocialMediaResponse
              | undefined;

            if (socialMediaResponse) {
              setHaveData(true);
              console.log("Social Media Addiction Risk:", socialMediaResponse);

              // Crear visualización basada en los datos de probabilidades
              const addictionProbability =
                socialMediaResponse.probabilities["Adicción"] * 100;
              const noAddictionProbability =
                socialMediaResponse.probabilities["No adicción"] * 100;

              const visualizations: ModelVisualizationData[] = [
                {
                  title: `Riesgo de Adicción a Redes Sociales - Nivel: ${socialMediaResponse.risk}`,
                  type: "pie",
                  data: [
                    {
                      label: "No Adicción",
                      value: noAddictionProbability,
                      color: "#4CAF50",
                    },
                    {
                      label: "Adicción",
                      value: addictionProbability,
                      color: "#F44336",
                    },
                  ],
                  width: 400,
                  height: 300,
                  xAxisLabel: "Nivel de Riesgo",
                  yAxisLabel: "Probabilidad (%)",
                  description: `Basado en tus datos, el modelo predice un riesgo ${socialMediaResponse.risk.toLowerCase()} de adicción a redes sociales.`,
                  additionalInfo: `Probabilidad de No Adicción: ${noAddictionProbability.toFixed(1)}% | Probabilidad de Adicción: ${addictionProbability.toFixed(1)}%`,
                },
              ];

              // Si hay datos de gráfico adicionales, agregar una visualización de barras
              if (socialMediaResponse.graph_data) {
                visualizations.push({
                  title: socialMediaResponse.graph_data.label,
                  type: "bar",
                  data: socialMediaResponse.graph_data.x.map(
                    (label, index) => ({
                      label,
                      value: socialMediaResponse.graph_data!.y[index] * 100,
                      color: label === "Adicción" ? "#F44336" : "#4CAF50",
                    })
                  ),
                  width: 400,
                  height: 300,
                  xAxisLabel: "Categoría",
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

        case "Árboles de Decisión": {
          async function fetchData() {
            const response = formData
              ? await Models.GetTreeVisualizationPrediction(formData)
              : undefined;

            const treeResponse = response as
              | TreeVisualizationResponse
              | undefined;

            if (treeResponse && treeResponse.tree_text) {
              setHaveData(true);
              const treeVisualizations: ModelVisualizationData[] = [
                {
                  title: "Árbol de Decisión",
                  type: "tree",
                  data: treeResponse.tree_text,
                  width: 800,
                  height: 600,
                },
              ];
              setVisualizations(treeVisualizations);
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
