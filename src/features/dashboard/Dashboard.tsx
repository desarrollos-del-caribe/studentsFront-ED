import { Link } from "react-router-dom";
import {
  Lock,
  TrendingUp,
  Zap,
  TreePine,
  GitBranch,
  Share2,
  Trees,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { ML_MODELS } from "../../shared/constants/mlModels";
import { Button } from "../../shared/components/Button";

export function Dashboard() {
  const formCompleted = localStorage.getItem("formCompleted") === "true";
  const availableModels = formCompleted ? ML_MODELS : [];
  const lockedModels: typeof ML_MODELS = formCompleted ? [] : ML_MODELS;

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard de Machine Learning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestros modelos avanzados de Machine Learning para analizar
            el impacto de las redes sociales en el rendimiento académico.
          </p>
        </div>

        {!formCompleted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Modelos Bloqueados
                  </h3>
                  <p className="text-yellow-700">
                    Completa el cuestionario para desbloquear todos los modelos
                    avanzados
                  </p>
                </div>
              </div>
              <Link to="/form">
                <Button>Completar Cuestionario</Button>
              </Link>
            </div>
          </div>
        )}

        {formCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  ¡Cuestionario Completado!
                </h3>
                <p className="text-green-700">
                  Ahora tienes acceso completo a todos los modelos de ML
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modelos Disponibles */}
        {availableModels.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Modelos Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableModels.map((model) => {
                const IconComponent = getModelIcon(model.algorithm);
                return (
                  <div key={model.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border hover:border-blue-300 p-6 ">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {model.accuracy}% precisión
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {model.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {model.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.use_cases_list.map((useCase, index) => (
                        <span
                          key={index}
                          className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {model.algorithm}
                      </span>
                      <Link key={model.id} to={`/models/${model.id}`}>
                        <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700">
                          Explorar →
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modelos Bloqueados */}
        {lockedModels.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Modelos Avanzados
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Requieren cuestionario completado)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedModels.map((model) => {
                const IconComponent = getModelIcon(model.algorithm);
                return (
                  <div
                    key={model.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 opacity-75"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <IconComponent className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-400">
                            {model.accuracy}% precisión
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-500 mb-2">
                        {model.name}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {model.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {model.use_cases_list.map((useCase, index) => (
                          <span
                            key={index}
                            className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {model.algorithm}
                        </span>
                        <Link
                          to="/form"
                          className="text-blue-600 font-medium text-sm hover:text-blue-700"
                        >
                          Desbloquear
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Nuestros modelos de Machine Learning analizan datos de uso de
              redes sociales y rendimiento académico para generar insights
              valiosos y predicciones precisas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Completa el Cuestionario
                </h3>
                <p className="text-gray-600 text-sm">
                  Proporciona información sobre tu uso de redes sociales y
                  rendimiento académico
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Explora los Modelos
                </h3>
                <p className="text-gray-600 text-sm">
                  Accede a diferentes algoritmos de ML para analizar tus datos
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Obtén Insights
                </h3>
                <p className="text-gray-600 text-sm">
                  Recibe análisis detallados y recomendaciones personalizadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
