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
  UserAnalysisResponse,
  Recommendation,
} from "../../shared/types/ml";

interface KMeansResponse {
  clusters: number;
  recommendations?: string[];
  features_data: string[];
  label: string;
  points: ScatterDataPoint[];
  user_point: ScatterDataPoint;
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
  const [userAnalysis, setUserAnalysis] = useState<UserAnalysisResponse | null>(
    null
  );
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Función para cargar análisis de usuario
  const loadUserAnalysis = async (userData: UserFormData) => {
    // Verificar que todos los campos necesarios estén completos
    if (
      !userData.age ||
      !userData.gender ||
      !userData.education_level ||
      !userData.social_media_usage ||
      !userData.main_platform ||
      !userData.sleep_hours_per_night ||
      !userData.relationship_status ||
      userData.conflicts_over_social_media === undefined ||
      !userData.country
    ) {
      return; // No cargar análisis si faltan datos
    }

    setLoadingAnalysis(true);
    try {
      const analysisResponse = await Models.PostAnalyzeUser(userData);
      setUserAnalysis(analysisResponse as UserAnalysisResponse);
    } catch (error) {
      console.error("Error al cargar análisis:", error);
      setUserAnalysis(null);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("formCompleted") === "true") {
      setIsUnlocked(true);
    }
    const storedData = localStorage.getItem("userFormData");
    const formData = storedData
      ? (JSON.parse(storedData) as UserFormData)
      : null;

    // Cargar análisis si hay datos del formulario
    if (formData) {
      loadUserAnalysis(formData);
    }

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
            console.log('Sleep Prediction:', sleepResponse);
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
              label: 'Tu Predicción',
            };
           

            const recommendations: Recommendation[] = sleepResponse.recommendations.map(rec => ({
              text: rec,
              severity: sleepResponse.predicted_sleep_hours_per_night < 6 ? 'high' :
                        (sleepResponse.predicted_sleep_hours_per_night >= 6 && sleepResponse.predicted_sleep_hours_per_night < 8) ? 'medium' : 'low'
            }));

            const visualizations: ModelVisualizationData[] = [
              {
                title: 'Regresión Lineal: Uso de Redes vs Sueño',
                type: 'linear',
                data: [...scatterPoints, userPoint],
                regressionLine: sleepResponse.regression_line || {
                  slope: -0.3,
                  intercept: 9.0,
                },
                width: 600,
                height: 400,
                xAxisLabel: 'Horas de Uso de Redes Sociales',
                yAxisLabel: 'Horas de Sueño por Noche',
                message: sleepResponse.message, // Pasar el mensaje de sleep_prediction
                recommendations, // Pasar las recomendaciones del endpoint
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
              console.log('Academic Impact:', academicImpact);
              console.log('Academic Risk:', academicRisk);
              const visualizations: ModelVisualizationData[] = [];
  
              if (academicImpact) {
                // Si hay dataset_points, crear visualización con puntos
                if (academicImpact.dataset_points && academicImpact.user_point) {
                  // Separar puntos por etiqueta
                  const noAffectsPoints = academicImpact.dataset_points
                    .filter((point) => point.label === 0)
                    .map((point) => ({
                      x: point.x,
                      y: point.y,
                      cluster: 0,
                      label: 'No Afecta',
                    }));
  
                  const affectsPoints = academicImpact.dataset_points
                    .filter((point) => point.label === 1)
                    .map((point) => ({
                      x: point.x,
                      y: point.y,
                      cluster: 1,
                      label: 'Afecta',
                    }));
  
                  // Punto del usuario
                  const userPoint = {
                    x: academicImpact.user_point.x,
                    y: academicImpact.user_point.y,
                    cluster: academicImpact.affects_academic_performance || 0,
                    label: 'Tu Predicción',
                  };
  
                  const allPoints = [...noAffectsPoints, ...affectsPoints, userPoint];
  
                  // Asignar severidad basada en affects_academic_performance
                  const severity = academicImpact.affects_academic_performance === 0 ? 'low' : 'high';
  
                  // Usar recomendaciones del endpoint y asignar severidad
                  const recommendations: Recommendation[] = academicImpact.recommendations.map(rec => ({
                    text: rec,
                    severity: severity,
                  }));
  
                  visualizations.push({
                    title: 'Regresión Logística: Impacto Académico',
                    type: 'scatter',
                    data: allPoints,
                    width: 700,
                    height: 500,
                    xAxisLabel: 'Horas de Uso de Redes Sociales',
                    yAxisLabel: 'Horas de Sueño por Noche',
                    description:
                      academicImpact.academic_impact_classification ||
                      'Análisis del impacto académico basado en patrones de uso de redes sociales y sueño.',
                    additionalInfo: `Predicción: ${academicImpact.affects_academic_performance === 0 ? 'No afecta tu rendimiento académico' : 'Podría afectar tu rendimiento académico'} (${(academicImpact.probability * 100).toFixed(1)}% confianza)`,
                    message: academicImpact.academic_impact_classification, // Usar como mensaje
                    recommendations, // Pasar recomendaciones del endpoint
                  });
                } else {
                  // Visualización de barras original si no hay dataset_points
                  const severity = academicImpact.impact?.toLowerCase() === 'low' || !academicImpact.impact ? 'low' : 'high';
                  const recommendations: Recommendation[] = academicImpact.recommendations.map(rec => ({
                    text: rec,
                    severity: severity,
                  }));
  
                  visualizations.push({
                    title: 'Impacto Académico',
                    type: 'bar',
                    data: [
                      {
                        label: academicImpact.impact || 'Sin impacto',
                        value: academicImpact.probability * 100,
                        color: '#2196F3',
                      },
                    ],
                    width: 400,
                    height: 300,
                    xAxisLabel: 'Impacto',
                    yAxisLabel: 'Probabilidad (%)',
                    message: academicImpact.academic_impact_classification, // Usar como mensaje
                    recommendations, // Pasar recomendaciones del endpoint
                  });
                }
              }
  
              if (academicRisk) {
                // Asignar severidad basada en risk
                const severity = academicRisk.risk?.toLowerCase() === 'low' || !academicRisk.risk ? 'low' : 'high';
                const recommendations: Recommendation[] = academicRisk.recommendations.map(rec => ({
                  text: rec,
                  severity: severity,
                }));
  
                visualizations.push({
                  title: 'Riesgo Académico',
                  type: 'bar',
                  data: [
                    {
                      label: academicRisk.risk || 'Sin riesgo',
                      value: academicRisk.probability * 100,
                      color: '#F44336',
                    },
                  ],
                  width: 400,
                  height: 300,
                  xAxisLabel: 'Riesgo',
                  yAxisLabel: 'Probabilidad (%)',
                  message: `Nivel de riesgo académico: ${academicRisk.risk || 'Sin riesgo'}`, // Mensaje personalizado
                  recommendations, // Pasar recomendaciones del endpoint
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
        
              const userCluster = kmeanResponse.user_point.cluster;
              const severity = userCluster === 0 ? 'low' : userCluster === 1 ? 'medium' : 'high';
        
              const recommendations: Recommendation[] = kmeanResponse.recommendations.map(rec => ({
                text: rec,
                severity: severity,
              }));
                
              // Asegurar que user_point se incluya en los datos con label "Tu Predicción"
              const userPointWithLabel = { ...kmeanResponse.user_point, label: 'Tu Predicción' };
              const allPoints = [...kmeanResponse.points, userPointWithLabel];
        
              const kmeansVisualizaciones: ModelVisualizationData[] = [
                {
                  title: "Distribución de Clusters",
                  type: "scatter",
                  data: allPoints,
                  width: 800,
                  height: 600,
                  xAxisLabel: "Horas de Uso de Redes Sociales",
                  yAxisLabel: "Horas de Sueño por Noche",
                  isClusteringModel: true, // Indicar que es un modelo de clustering
                  message: kmeanResponse.label,
                  recommendations,
                  additionalInfo: `Tu punto está en el cluster ${userCluster}.`,
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
              const socialMediaUsage = formData?.social_media_usage || 0; // Obtener uso de redes del formulario
        
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
                  additionalInfo: `Con un uso de ${socialMediaUsage} horas de redes sociales, tu probabilidad de riesgo es ${addictionProbability.toFixed(1)}% | Tu riesgo de ser adicto a la tecnología es ${socialMediaResponse.risk}`,
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
                  additionalInfo: `Con un uso de ${socialMediaUsage} horas de redes sociales, tu probabilidad de riesgo es ${addictionProbability.toFixed(1)}% | Tu riesgo de ser adicto a la tecnología es ${socialMediaResponse.risk}`,
                });
              }
        
              // Usar recomendaciones del endpoint y asignar severidad basada en el risk
              const severity = socialMediaResponse.risk.toLowerCase() === 'bajo' ? 'low' :
                              socialMediaResponse.risk.toLowerCase() === 'medio' ? 'medium' : 'high';
              const endpointRecommendations: Recommendation[] = socialMediaResponse.recommendations.map(rec => ({
                text: rec,
                severity: severity,
              }));
        
              // Asignar recomendaciones del endpoint solo a la primera visualización (pie chart)
              visualizations[0].recommendations = endpointRecommendations;
        
              // Asignar recomendaciones hardcodeadas específicas para la segunda visualización (barras) si existe
              if (visualizations.length > 1) {
                const hardcodedRecommendations: Recommendation[] = [
                  {
                    text: `Con ${socialMediaUsage} horas de uso, considera reducir tu tiempo en redes sociales para bajar tu riesgo de ${addictionProbability.toFixed(1)}%.`,
                    severity: severity,
                  },
                  {
                    text: "Establece límites diarios para evitar un uso excesivo de tecnología.",
                    severity: severity,
                  },
                  {
                    text: "Busca actividades alternativas para equilibrar tu tiempo en línea.",
                    severity: severity,
                  },
                ];
                visualizations[1].recommendations = hardcodedRecommendations;
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
                  additionalInfo: `Este árbol predice el ${treeResponse.target} basado en tus datos. Analiza las ramas para identificar patrones de adicción.`, // Mensaje personalizado
                  recommendations: treeResponse.recommendations.map(rec => ({
                    text: rec,
                    severity: 'low', // Severidad genérica, ajustable si el endpoint lo proporciona
                  })),
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
        case "Support Vector Machine": {
          async function fetchData() {
            const response = formData
              ? await Models.PostAnalyzeUser(formData)
              : undefined;
        
            const analysisResponse = response as UserAnalysisResponse | undefined;
        
            if (analysisResponse) {
              setHaveData(true);
              console.log("Respuesta de Análisis SVM:", analysisResponse);
        
              // Generar datos de ejemplo para la visualización SVM
              const datasetPoints: ScatterDataPoint[] = [
                { x: 1, y: 8, cluster: 0, label: 'No Afecta' },
                { x: 2, y: 7, cluster: 0, label: 'No Afecta' },
                { x: 3, y: 6, cluster: 0, label: 'No Afecta' },
                { x: 4, y: 5, cluster: 1, label: 'Afecta' },
                { x: 5, y: 4, cluster: 1, label: 'Afecta' },
                { x: 6, y: 3, cluster: 1, label: 'Afecta' },
              ];
        
              // Punto del usuario basado en el formulario
              const userPoint: ScatterDataPoint = {
                x: formData.social_media_usage,
                y: formData.sleep_hours_per_night,
                cluster: analysisResponse.affects_academic_performance || 0,
                label: 'Tu Predicción',
              };
        
              // Combinar puntos con el user_point
              const allPoints = [...datasetPoints, userPoint];
        
              const visualizations: ModelVisualizationData[] = [
                {
                  title: 'Análisis General con SVM',
                  type: 'scatter',
                  data: allPoints,
                  width: 700,
                  height: 500,
                  xAxisLabel: 'Horas de Uso de Redes Sociales',
                  yAxisLabel: 'Horas de Sueño por Noche',
                  description: 'Clasificación del impacto académico basada en uso y sueño.',
                },
                {
                  title: 'Impacto Académico',
                  type: 'text',
                  data: '', 
                  width: 300,
                  height: 200,
                  additionalInfo: analysisResponse.classifications.academic_impact,
                },
                {
                  title: 'Adicción',
                  type: 'text',
                  data: '',
                  width: 300,
                  height: 200,
                  additionalInfo: analysisResponse.classifications.addiction,
                },
                {
                  title: 'Conflictos',
                  type: 'text',
                  data: '',
                  width: 300,
                  height: 200,
                  additionalInfo: analysisResponse.classifications.conflicts,
                },
                {
                  title: 'Salud Mental',
                  type: 'text',
                  data: '',
                  width: 300,
                  height: 200,
                  additionalInfo: analysisResponse.classifications.mental_health,
                },
                {
                  title: 'Plataforma',
                  type: 'text',
                  data: '',
                  width: 300,
                  height: 200,
                  additionalInfo: analysisResponse.classifications.platform,
                },
                {
                  title: 'Sueño',
                  type: 'text',
                  data: '',
                  width: 300,
                  height: 200,
                  additionalInfo: analysisResponse.classifications.sleep,
                },
                {
                  title: 'Uso',
                  type: 'text',
                  data: '',
                  width: 300,
                  height: 200,
                  additionalInfo: analysisResponse.classifications.usage,
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
                  <div className="flex flex-col">
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
              <>
                <ModelData
                  visualizations={visualizations}
                  title={model?.name || "Modelo"}
                />

                {/* Tarjeta de Recomendaciones */}
                {loadingAnalysis && (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center mt-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">
                      Cargando análisis personalizado...
                    </p>
                  </div>


                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
