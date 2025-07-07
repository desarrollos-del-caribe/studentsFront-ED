import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ML_MODELS } from "../../shared/constants/mlModels";
import { ArrowLeft } from "lucide-react";
import ModelNoData from "./ModelNoData";
import { RenderIcon } from "../../shared/components";
import ModelLock from "./ModelLock";
import * as Models from "../../shared/services/model.services";
import type { UserFormData } from "../../shared/types/ml";

export default function ModelDetail() {
  const { modelId } = useParams<{ modelId: string }>();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const model = ML_MODELS.find((m) => m.id === parseInt(modelId || "0"));
  const [haveData, setHaveData] = useState<boolean>(false);

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
            const [response1, response2] = formData
              ? await Promise.all([
                  Models.PostMentalScorePrediction(formData),
                  Models.PostSleepPrediction(formData),
                ])
              : [undefined, undefined];

            if (response1 || response2) {
              setHaveData(true);
              console.log("Mental Score:", response1);
              console.log("Sleep Prediction:", response2);
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
              console.log("K-Means:", response);
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
          </div>
        </div>
      )}
    </>
  );
}
