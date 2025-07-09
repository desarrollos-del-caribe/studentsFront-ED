export interface UserFormData {
  age: number;
  gender: string;
  education_level: string;
  social_media_usage: number;
  main_platform: string;
  sleep_hours_per_night: number;
  relationship_status: string;
  conflicts_over_social_media: number;
  country: string;
  mental_health_score?: number;
  addicted_score?: number;
}

export interface SelectForm {
  value: string;
  label: string;
}

export interface MLModel {
  id: number;
  name: string;
  icon: string;
  algorithm: string;
  description: string;
  accuracy: number;
  use_cases: string;
  use_cases_list: string[];
  is_locked: boolean;
  unlock_condition: string;
  created_at: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  z?: number;
  cluster?: number ;
  label?: string;
}

export interface TreeNode {
  label: string;
  target: string;
  tree_text: string;
}

export interface ModelVisualizationData {
  title: string;
  type: "bar" | "line" | "pie" | "scatter" | "histogram" | "tree" | "linear" | "svm" | "text";
  data: ChartDataPoint[] | ScatterDataPoint[] | string;
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  regressionLine?: { slope: number; intercept: number };
  description?: string;
  additionalInfo?: string;
  isClusteringModel?: boolean; 
  recommendations?: Recommendation[];
  message?: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface ModelPerformanceData {
  metrics: ModelMetrics;
  confusionMatrix?: number[][];
  featureImportance?: ChartDataPoint[];
  predictionDistribution?: ChartDataPoint[];
}

export interface UserAnalysisResponse {
  addicted_score: number;
  mental_health_score: number;
  affects_academic_performance: number;
  classifications: {
    mental_health: string;
    addiction: string;
    sleep: string;
    academic_impact: string;
    platform: string;
    usage: string;
    conflicts: string;
  };
  recommendations: string[];
  risk_factors: string[];
}
export interface Recommendation {
  text: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SocialMediaResponse {
  risk: "Alto" | "Bajo" | "Desconocido";
  probabilities: {
    "No adicción": number;
    "Adicción": number;
  };
  message: string;
  graph_data?: {
    label: string;
    labels: string[];
    values: number[];
  };
  recommendations: string[];
  error?: string;
}

export interface KMeansResponse {
  clusters: number;
  features_used: string[];
  points: ScatterDataPoint[];
  user_point: ScatterDataPoint;
  label: string;
  recommendations: string[];
  severity: "alto" | "moderado" | "bajo" | "desconocido";
  cluster_stats: { [key: string]: { [key: string]: number } };
  error?: string;
}
export interface TreeResponse {
  tree_text: string;
  target: string;
  label: string;
  recommendations: string[];
  severity: "alto" | "moderado" | "bajo" | "desconocido";
  prediction: number | string | null;
  error?: string;
}

export interface SleepPredictionResponse {
  recommendations: any;
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

export interface AcademicResponse {
  recommendations: any;
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
