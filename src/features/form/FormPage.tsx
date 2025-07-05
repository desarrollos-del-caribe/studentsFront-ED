import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Save, ArrowRight } from "lucide-react";
import type { UserFormData } from "../../shared/types/ml";
import { FORM_OPTIONS } from "../../shared/constants/mlModels";
import { Button } from "../../shared/components/Button";

export function FormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    age: 20,
    gender: "Masculino",
    education_level: "Universidad",
    social_media_usage: 3,
    academic_performance: 75,
    main_platform: "Instagram",
    study_hours: 25,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.age < 16 || formData.age > 65) {
      newErrors.age = "Edad debe estar entre 16 y 65 años";
    }

    if (formData.social_media_usage < 1 || formData.social_media_usage > 10) {
      newErrors.social_media_usage = "Debe estar entre 1 y 10 horas";
    }

    if (formData.study_hours < 0 || formData.study_hours > 80) {
      newErrors.study_hours = "Debe estar entre 0 y 80 horas semanales";
    }

    if (
      formData.academic_performance < 0 ||
      formData.academic_performance > 100
    ) {
      newErrors.academic_performance = "Debe estar entre 0 y 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simular envío exitoso
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Guardar en localStorage para persistencia
      localStorage.setItem("userFormData", JSON.stringify(formData));
      localStorage.setItem("formCompleted", "true");

      navigate("/dashboard", {
        state: {
          formCompleted: true,
          message: "¡Datos guardados exitosamente!",
        },
      });
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setErrors({ submit: "Error al enviar formulario. Inténtalo de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Cuestionario de Análisis
                </h1>
                <p className="text-blue-100 mt-2">
                  Completa este formulario para desbloquear análisis avanzados
                  de ML
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Información Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad *
                </label>
                <input
                  type="number"
                  min="16"
                  max="65"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.age}
                  onChange={(e) =>
                    handleInputChange("age", parseInt(e.target.value))
                  }
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  {FORM_OPTIONS.genders.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel Educativo *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.education_level}
                  onChange={(e) =>
                    handleInputChange("education_level", e.target.value)
                  }
                >
                  {FORM_OPTIONS.educationLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plataforma Principal *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.main_platform}
                  onChange={(e) =>
                    handleInputChange("main_platform", e.target.value)
                  }
                >
                  {FORM_OPTIONS.platforms.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Datos Académicos y de Uso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uso Diario de Redes Sociales (horas) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.social_media_usage
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.social_media_usage}
                  onChange={(e) =>
                    handleInputChange(
                      "social_media_usage",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <p className="text-gray-500 text-xs mt-1">Entre 1 y 10 horas</p>
                {errors.social_media_usage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.social_media_usage}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas de Estudio Semanales *
                </label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.study_hours ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.study_hours}
                  onChange={(e) =>
                    handleInputChange("study_hours", parseInt(e.target.value))
                  }
                />
                <p className="text-gray-500 text-xs mt-1">Entre 0 y 80 horas</p>
                {errors.study_hours && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.study_hours}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendimiento Académico Promedio *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.academic_performance
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.academic_performance}
                  onChange={(e) =>
                    handleInputChange(
                      "academic_performance",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <p className="text-gray-500 text-xs mt-1">Escala de 0 a 100</p>
                {errors.academic_performance && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.academic_performance}
                  </p>
                )}
              </div>
            </div>

            {/* Error de envío */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Guardar y Continuar</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormPage;
