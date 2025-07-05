import { Link } from "react-router-dom";
import {
  Brain,
  TrendingUp,
  Zap,
  TreePine,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../shared/components/Button";

export function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: "Regresión Lineal y Logística",
      description:
        "Modelos predictivos avanzados para análisis de tendencias y clasificación binaria.",
    },
    {
      icon: Zap,
      title: "K-Means Clustering",
      description:
        "Algoritmos de agrupamiento no supervisado para descubrir patrones ocultos.",
    },
    {
      icon: TreePine,
      title: "Random Forest & Árboles",
      description:
        "Métodos ensemble y árboles de decisión para regresión y clasificación.",
    },
  ];

  const benefits = [
    "Análisis completo de datos sociales y académicos",
    "Visualizaciones interactivas en tiempo real",
    "Modelos pre-entrenados y optimizados",
    "Interfaz intuitiva y profesional",
    "Resultados interpretables y accionables",
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="absolute inset-0 opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Brain className="h-20 w-20 text-blue-600" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Plataforma de
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Machine Learning
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Analiza el impacto de las redes sociales en el rendimiento
              académico usando algoritmos avanzados de Machine Learning con
              visualizaciones profesionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/form">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Comenzar Análisis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link to="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Ver Modelos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Modelos de Machine Learning Disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Utiliza algoritmos de última generación para analizar datos y
              generar insights valiosos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir nuestra plataforma?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Combinamos la potencia del Machine Learning con una interfaz
                intuitiva para brindarte análisis profundos y accionables sobre
                el comportamiento digital.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/form">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Empezar Ahora
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="font-semibold text-gray-700">
                      Regresión Lineal
                    </span>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="font-semibold text-gray-700">
                      K-Means Clustering
                    </span>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <span className="font-semibold text-gray-700">
                      Random Forest
                    </span>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <span className="font-semibold text-gray-700">
                      Árboles de Decisión
                    </span>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Completa el formulario para desbloquear todos los modelos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white relative inset-shadow-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para comenzar tu análisis?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Completa nuestro formulario y descubre insights únicos sobre el
            impacto de las redes sociales en tu rendimiento académico.
          </p>
          <Link to="/form">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Completar Formulario
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
