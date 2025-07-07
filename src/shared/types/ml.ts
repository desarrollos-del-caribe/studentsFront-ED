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
  cluster?: number;
  label?: string;
}

export interface TreeNode {
  label: string;
  target: string;
  tree_text: string;
}

export interface ModelVisualizationData {
  title: string;
  type: "bar" | "line" | "pie" | "scatter" | "histogram" | "tree" | "linear" | "svm";
  data: ChartDataPoint[] | ScatterDataPoint[] | string;
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  regressionLine?: { slope: number; intercept: number };
  description?: string;
  additionalInfo?: string;
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