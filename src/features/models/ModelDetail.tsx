import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  ArrowLeft,
  TrendingUp,
  Zap,
  TreePine,
  GitBranch,
  Share2,
  Trees,
  BarChart3,
  Activity,
  Play,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { ML_MODELS } from "../../shared/constants/mlModels";
import { Button } from "../../shared/components/Button";
import { modelApi, visualizationApi } from "../../shared/services/api";
import type { MLAnalysisResult } from "../../shared/types/ml";

interface VisualizationData {
  name: string;
  value: number;
  x?: number;
  y?: number;
  predicted?: number;
  actual?: number;
  platform?: string;
  users?: number;
  performance?: number;
  usage?: number;
  risk_level?: string;
  cluster?: number;
  confidence?: number;
}

interface ModelResults {
  model_data: MLAnalysisResult | null;
  visualization_data: VisualizationData[];
}

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
  "#F97316", // orange-500
];

const RISK_COLORS = {
  Bajo: "#10B981",
  Medio: "#F59E0B",
  Alto: "#EF4444",
};

export function ModelDetail() {
  const { modelId } = useParams<{ modelId: string }>();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ModelResults>({
    model_data: null,
    visualization_data: [],
  });

  const model = ML_MODELS.find((m) => m.id === parseInt(modelId || "0"));

  const loadVisualizationData = useCallback(async () => {
    try {
      const dashboardData = await visualizationApi.getDashboard();
      const socialVsPerf = await visualizationApi.getSocialVsPerformance();

      let demoData: VisualizationData[] = [];

      if (model) {
        switch (model.id) {
          case 1:
            demoData = socialVsPerf.data.social_media_usage
              .slice(0, 15)
              .map((usage, index) => ({
                name: `Estudiante ${index + 1}`,
                x: usage,
                y: socialVsPerf.data.academic_performance[index],
                usage: usage,
                performance: socialVsPerf.data.academic_performance[index],
                value: socialVsPerf.data.academic_performance[index],
              }));
            break;
          case 2: {
            const riskDist = dashboardData.summary.risk_distribution;
            demoData = [
              { name: "Bajo Riesgo", value: riskDist.low, risk_level: "Bajo" },
              {
                name: "Riesgo Medio",
                value: riskDist.medium,
                risk_level: "Medio",
              },
              { name: "Alto Riesgo", value: riskDist.high, risk_level: "Alto" },
            ];
            break;
          }
          case 3: {
            const platformData = await visualizationApi.getPlatforms();
            demoData = platformData.data.platforms.map((platform, index) => ({
              name: platform,
              value: platformData.data.user_counts[index],
              platform: platform,
              users: platformData.data.user_counts[index],
            }));
            break;
          }
          default:
            demoData = Array.from({ length: 10 }, (_, i) => ({
              name: `Dato ${i + 1}`,
              value: Math.random() * 100 + 20,
              x: i + 1,
              y: Math.random() * 100 + 20,
            }));
        }
      }

      setResults({
        model_data: null,
        visualization_data: demoData,
      });
    } catch (err) {
      console.error("Error loading visualization data:", err);
      setError("Error al cargar los datos de visualización");
    }
  }, [model]);

  const loadModelData = useCallback(
    async (userId: number) => {
      if (!model) return;

      try {
        const analysisResult = await modelApi.getResults(model.id, userId);
        let visualizationData: VisualizationData[] = [];

        switch (model.id) {
          case 1: {
            const socialVsPerf =
              await visualizationApi.getSocialVsPerformance();
            visualizationData = socialVsPerf.data.social_media_usage.map(
              (usage, index) => ({
                name: `Usuario ${index + 1}`,
                x: usage,
                y: socialVsPerf.data.academic_performance[index],
                usage: usage,
                performance: socialVsPerf.data.academic_performance[index],
                value: socialVsPerf.data.academic_performance[index],
              })
            );
            break;
          }
          case 2: {
            const dashboardData = await visualizationApi.getDashboard();
            const riskDist = dashboardData.summary.risk_distribution;
            visualizationData = [
              { name: "Bajo Riesgo", value: riskDist.low, risk_level: "Bajo" },
              {
                name: "Riesgo Medio",
                value: riskDist.medium,
                risk_level: "Medio",
              },
              { name: "Alto Riesgo", value: riskDist.high, risk_level: "Alto" },
            ];
            break;
          }
          case 3: {
            const platformData = await visualizationApi.getPlatforms();
            visualizationData = platformData.data.platforms.map(
              (platform, index) => ({
                name: platform,
                value: platformData.data.user_counts[index],
                platform: platform,
                users: platformData.data.user_counts[index],
              })
            );
            break;
          }
          default: {
            const ageData = await visualizationApi.getAgeDistribution();
            visualizationData = ageData.data.ages.map((age, index) => ({
              name: `${age} años`,
              x: age,
              y: ageData.data.frequencies[index],
              value: ageData.data.frequencies[index],
              actual: ageData.data.frequencies[index],
              predicted:
                ageData.data.frequencies[index] + (Math.random() - 0.5) * 2,
            }));
            break;
          }
        }

        setResults({
          model_data: analysisResult,
          visualization_data: visualizationData,
        });
      } catch (err) {
        console.error("Error loading model data:", err);
        await loadVisualizationData();
      }
    },
    [model, loadVisualizationData]
  );

  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const formCompleted = localStorage.getItem("formCompleted") === "true";
        const userId = localStorage.getItem("currentUserId");

        setIsUnlocked(formCompleted || !model?.is_locked);

        if (model && formCompleted && userId) {
          await loadModelData(parseInt(userId));
        } else if (model) {
          await loadVisualizationData();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los datos"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, [model, loadModelData, loadVisualizationData]);

  const handleTrainModel = async () => {
    if (!isUnlocked || !model) return;

    setIsTraining(true);
    setError(null);

    try {
      const userId = localStorage.getItem("currentUserId");

      if (userId) {
        const trainingResult = await modelApi.train(model.id, parseInt(userId));

        setResults((prev) => ({
          ...prev,
          model_data: trainingResult,
        }));

        await loadModelData(parseInt(userId));
      } else {
        setError(
          "Usuario no encontrado. Por favor, complete el formulario primero."
        );
      }
    } catch (err) {
      console.error("Error training model:", err);
      setError(
        err instanceof Error ? err.message : "Error al entrenar el modelo"
      );
    } finally {
      setIsTraining(false);
    }
  };

  const getModelIcon = (algorithm: string) => {
    switch (algorithm) {
      case "Linear Regression":
        return TrendingUp;
      case "Logistic Regression":
        return GitBranch;
      case "K-Means":
        return Zap;
      case "Random Forest":
        return Trees;
      case "Decision Tree":
        return TreePine;
      case "SVM":
        return Share2;
      default:
        return BarChart3;
    }
  };

  const renderVisualization = () => {
    if (!model || results.visualization_data.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay datos disponibles para visualizar</p>
          </div>
        </div>
      );
    }

    const data = results.visualization_data;

    switch (model.id) {
      case 1: // Linear Regression - Social Media vs Academic Performance
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="usage"
                type="number"
                domain={[0, 10]}
                label={{
                  value: "Horas de uso de redes sociales",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                dataKey="performance"
                type="number"
                domain={[0, 100]}
                label={{
                  value: "Rendimiento académico (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === "performance" ? `${value}%` : `${value}h`,
                  name === "performance" ? "Rendimiento" : "Uso de redes",
                ]}
                labelFormatter={(label) => `Estudiante: ${label}`}
              />
              <Scatter dataKey="performance" fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 2: // Logistic Regression - Risk Classification
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.risk_level
                        ? RISK_COLORS[
                            entry.risk_level as keyof typeof RISK_COLORS
                          ]
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} estudiantes`, "Cantidad"]}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 3: // K-Means - Platform Clustering
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis
                label={{
                  value: "Número de usuarios",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} usuarios`, "Cantidad"]}
              />
              <Bar dataKey="value" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default: // Random Forest, Decision Tree, SVM
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="x"
                label={{ value: "Edad", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                label={{
                  value: "Frecuencia",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value}`,
                  name === "actual" ? "Datos reales" : "Predicción",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke={COLORS[0]}
                strokeWidth={2}
                name="Datos reales"
                dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
              />
              {data.some((d) => d.predicted !== undefined) && (
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke={COLORS[1]}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicción del modelo"
                  dot={{ fill: COLORS[1], strokeWidth: 2, r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  if (!model) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Modelo no encontrado
          </h1>
          <Link to="/dashboard">
            <Button>Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = getModelIcon(model.algorithm);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Modelo Bloqueado
            </h1>
            <p className="text-gray-600 mb-8">
              Este modelo requiere completar el cuestionario para ser
              desbloqueado.
            </p>
            <div className="space-x-4">
              <Link to="/form">
                <Button>Completar Cuestionario</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary">Volver al Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
                <IconComponent className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {model.name}
                </h1>
                <p className="text-gray-600 mt-2">{model.description}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {model.accuracy}% Precisión
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {model.algorithm}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleTrainModel}
                disabled={isTraining}
                className="flex items-center space-x-2"
              >
                {isTraining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Entrenando...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Entrenar Modelo</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visualización Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Visualización del Modelo
                </h2>
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span className="text-sm">Cargando datos...</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {renderVisualization()}
            </div>
          </div>

          {/* Panel de Información */}
          <div className="space-y-6">
            {/* Casos de Uso */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Casos de Uso
              </h3>
              <div className="space-y-2">
                {model.use_cases_list.map((useCase, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span>{useCase}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resultados */}
            {results.model_data && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resultados del Análisis
                </h3>
                <div className="space-y-4">
                  {results.model_data.results.accuracy && (
                    <div>
                      <p className="text-sm text-gray-600">Precisión</p>
                      <p className="text-2xl font-bold text-green-600">
                        {results.model_data.results.accuracy.toFixed(1)}%
                      </p>
                    </div>
                  )}
                  {results.model_data.results.prediction && (
                    <div>
                      <p className="text-sm text-gray-600">Predicción</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {typeof results.model_data.results.prediction ===
                        "number"
                          ? `${results.model_data.results.prediction.toFixed(1)}%`
                          : results.model_data.results.prediction}
                      </p>
                    </div>
                  )}
                  {results.model_data.results.risk_level && (
                    <div>
                      <p className="text-sm text-gray-600">Nivel de Riesgo</p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          results.model_data.results.risk_level === "Alto"
                            ? "bg-red-100 text-red-800"
                            : results.model_data.results.risk_level === "Medio"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {results.model_data.results.risk_level}
                      </span>
                    </div>
                  )}
                  {results.model_data.results.cluster && (
                    <div>
                      <p className="text-sm text-gray-600">Clúster</p>
                      <p className="text-lg font-semibold text-blue-600">
                        Grupo {results.model_data.results.cluster}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interpretación */}
            {results.model_data?.results.interpretation && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Interpretación
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Resumen
                    </h4>
                    <p className="text-sm text-gray-600">
                      {results.model_data.results.interpretation.summary}
                    </p>
                  </div>
                  {results.model_data.results.interpretation.key_factors
                    .length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Factores Clave
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {results.model_data.results.interpretation.key_factors.map(
                          (factor, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              <span>{factor}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {results.model_data.results.interpretation.recommendations
                    .length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Recomendaciones
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {results.model_data.results.interpretation.recommendations.map(
                          (rec, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                              <span>{rec}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Nivel de Confianza
                    </h4>
                    <p className="text-sm text-gray-600">
                      {
                        results.model_data.results.interpretation
                          .confidence_level
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelDetail;
