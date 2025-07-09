import genericRequest from "./api";
import type {
  UserFormData,
  SleepPredictionResponse,
  AcademicResponse,
  SocialMediaResponse,
  TreeResponse,
  KMeansResponse,
  UserAnalysisResponse,
} from "../types/ml";

const environment = import.meta.env.VITE_ENVIRONMENT;
const BASE_URL = environment === "production" ? import.meta.env.VITE_API_URL : "http://localhost:5000/api";

// Regresión Lineal
export const PostMentalScorePrediction = async (data: UserFormData): Promise<UserAnalysisResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/mental-health`, data);
  return response as UserAnalysisResponse;
};

export const PostSleepPrediction = async (data: UserFormData): Promise<SleepPredictionResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/sleep-prediction`, data);
  return response as SleepPredictionResponse;
};

// Regresión Logística
export const PostAcademicImpactPrediction = async (data: UserFormData): Promise<AcademicResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/academic-impact`, data);
  return response as AcademicResponse;
};

export const PostAcademicRiskPrediction = async (data: UserFormData): Promise<AcademicResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/academic-risk`, data);
  return response as AcademicResponse;
};

// Random Forest
export const PostSocialMediaAddictionRiskPrediction = async (data: UserFormData): Promise<SocialMediaResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/addiction-risk`, data);
  return response as SocialMediaResponse;
};

// Árboles de Decisión
export const GetTreeVisualizationPrediction = async (data: UserFormData): Promise<TreeResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/tree-visualization?target=Addicted_Score`, data);
  return response as TreeResponse;
};

// K-Means Clustering
export const GetKMeansClusteringPrediction = async (data: UserFormData): Promise<KMeansResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/kmeans-clustering`, data);
  return response as KMeansResponse;
};

// Estadística Descriptiva
export const GetDescriptiveStatistics = async (data: UserFormData): Promise<any> => {
  const response = await genericRequest.GetUrl(`${BASE_URL}/models/addiction-by-country`, data);
  return response;
};

// Rendimiento Estudiantil
export const GetStudentPerformance = async (studentId: string): Promise<any> => {
  const response = await genericRequest.GetUrl(`${BASE_URL}/models/student-performance/${studentId}`);
  return response;
};

export const PostAnalyzeUser = async (data: UserFormData): Promise<UserAnalysisResponse> => {
  const response = await genericRequest.PostUrl(`${BASE_URL}/models/analyze-user`, data);
  return response as UserAnalysisResponse;
};