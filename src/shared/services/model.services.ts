import genericRequest from "./api";
import type { UserFormData } from "../types/ml";

const environment = import.meta.env.VITE_ENVIRONMENT;
const BASE_URL =  environment === "production" ? import.meta.env.VITE_API_URL : "http://localhost:5000/api";

//Regresión Lineal
export const PostMentalScorePrediction = async (data: UserFormData) => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/mental-health`, data);
  return response;
};

export const PostSleepPrediction = async (data: UserFormData) => {
    const response = await genericRequest.PostUrl(`${BASE_URL}/models/sleep-prediction`, data);
    return response;
};

// Regresión Logística
export const PostAcademicImpactPrediction = async (data: UserFormData) => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/academic-impact`, data);
  return response;
};

export const PostAcademicRiskPrediction = async (data: UserFormData) => {
    const response = await genericRequest.PostUrl(`${BASE_URL}/models/academic-risk`, data);
    return response;
};

// Random Forest
export const PostSocialMediaAddictionRiskPrediction = async (data: UserFormData) => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/addiction-risk`, data);
  return response;
};

// Árboles de Decisión
export const GetTreeVisualizationPrediction = async (data: UserFormData) => {
  const response = await genericRequest.GetUrl(`${BASE_URL}/models/tree-visualization`, data);
  return response;
};

// K-Means Clustering
export const GetKMeansClusteringPrediction = async (data: UserFormData) => {
  const response = await genericRequest.GetUrl(`${BASE_URL}/models/kmeans-clustering`, data);
  return response;
};

// Estadistica Descriptiva
export const GetDescriptiveStatistics = async (data: UserFormData) => {
  const response = await genericRequest.GetUrl(`${BASE_URL}/models/addiction-by-country`, data);
  return response;
};