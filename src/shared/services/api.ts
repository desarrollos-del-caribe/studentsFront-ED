import type { User, CreateUserRequest, MLModel, MLAnalysisResult, Visualization } from '../types/ml';

const API_BASE = 'http://localhost:5000/api';

interface ApiConfig {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

const apiCall = async <T>(endpoint: string, method = 'GET', data: unknown = null): Promise<T> => {
  const config: ApiConfig = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error en la API');
    }

    return result;
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
};

export const userApi = {
  getAll: () => apiCall<{ users: User[]; total: number }>('/api/users'),
  
  getById: (id: number) => apiCall<{ user: User }>(`/api/users/${id}`),
  
  create: (userData: CreateUserRequest) => 
    apiCall<{ message: string; user: User }>('/api/users', 'POST', userData),
  
  update: (id: number, userData: Partial<CreateUserRequest>) =>
    apiCall<{ message: string; user: User }>(`/api/users/${id}`, 'PUT', userData),
  
  delete: (id: number) =>
    apiCall<{ message: string }>(`/api/users/${id}`, 'DELETE'),
};

export const modelApi = {
  getAll: () => apiCall<{ models: MLModel[]; total: number }>('/api/models'),
  
  getById: (id: number) => apiCall<{ model: MLModel }>(`/api/models/${id}`),
  
  train: (modelId: number, userId: number) =>
    apiCall<MLAnalysisResult>(`/api/models/${modelId}/train`, 'POST', { user_id: userId }),
  
  getResults: (modelId: number, userId: number) =>
    apiCall<MLAnalysisResult>(`/api/models/${modelId}/results/${userId}`),
};

export const analysisApi = {
  analyzeUser: (userId: number) =>
    apiCall<{
      user_info: User;
      comprehensive_analysis: {
        status: string;
        timestamp: string;
        user_profile: {
          risk_level: 'Bajo' | 'Medio' | 'Alto';
          academic_prediction: number;
          social_media_impact: string;
          study_efficiency: string;
        };
        model_comparison: Array<{
          algorithm: string;
          accuracy: number;
          prediction: number;
          confidence: number;
        }>;
        interpretation: {
          summary: string;
          key_factors: string[];
          recommendations: string[];
        };
      };
      individual_models: Record<string, MLAnalysisResult>;
      summary: {
        total_models_executed: number;
        models_with_errors: number;
        analysis_timestamp: string;
        risk_assessment: string;
        academic_prediction: number;
      };
    }>(`/api/analyze/user/${userId}`, 'POST'),
  
  getPredictions: (userId: number) =>
    apiCall<{
      user_id: number;
      predictions: Array<{
        id: number;
        model_id: number;
        model_name: string;
        prediction_value: number;
        confidence: number;
        risk_level: string;
        timestamp: string;
        input_data: object;
      }>;
      total: number;
      latest_prediction: {
        value: number;
        confidence: number;
        model_used: string;
        timestamp: string;
      };
    }>(`/api/predictions/${userId}`),
  
  compareModels: (userId?: number) => {
    const endpoint = userId ? `/api/analyze/models/compare?user_id=${userId}` : '/api/analyze/models/compare';
    return apiCall<{
      comparison_results: Array<{
        model_name: string;
        algorithm: string;
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        execution_time: string;
      }>;
      best_model: {
        name: string;
        accuracy: number;
        recommendation: string;
      };
      timestamp: string;
    }>(endpoint);
  },
};

// VISUALIZACIONES
export const visualizationApi = {
  getDashboard: () =>
    apiCall<{
      visualizations: Visualization[];
      summary: {
        total_users: number;
        average_performance: number;
        most_used_platform: string;
        risk_distribution: {
          low: number;
          medium: number;
          high: number;
        };
      };
      recommendations: string[];
      timestamp: string;
    }>('/api/visualizations/dashboard'),
  
  getAgeDistribution: () =>
    apiCall<{
      type: 'histogram';
      title: string;
      data: {
        ages: number[];
        frequencies: number[];
        bins: number[];
      };
      statistics: {
        mean_age: number;
        median_age: number;
        age_range: [number, number];
      };
      insights: string[];
      image_path?: string;
    }>('/api/visualizations/age-distribution'),
  
  getSocialVsPerformance: () =>
    apiCall<{
      type: 'scatter';
      title: string;
      data: {
        social_media_usage: number[];
        academic_performance: number[];
        user_ids: number[];
      };
      correlation: {
        coefficient: number;
        strength: 'Débil' | 'Moderada' | 'Fuerte';
        direction: 'Positiva' | 'Negativa';
      };
      insights: string[];
      image_path?: string;
    }>('/api/visualizations/social-vs-performance'),
  
  getPlatforms: () =>
    apiCall<{
      type: 'pie_chart';
      title: string;
      data: {
        platforms: string[];
        user_counts: number[];
        percentages: number[];
      };
      most_popular: {
        platform: string;
        percentage: number;
        user_count: number;
      };
      insights: string[];
      image_path?: string;
    }>('/api/visualizations/platforms'),
};

export default {
  user: userApi,
  model: modelApi,
  analysis: analysisApi,
  visualization: visualizationApi,
};
