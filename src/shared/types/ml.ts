export interface UserFormData {
  name: string;
  email: string;
  age: number;
  gender: "Masculino" | "Femenino" | "Otro";
  education_level: "Bachillerato" | "Universidad" | "Posgrado";
  social_media_usage: number;
  main_platform:
    | "Instagram"
    | "TikTok"
    | "Facebook"
    | "Twitter"
    | "YouTube"
    | "LinkedIn";
  sleep_hours_per_night: number;
  relationship_status: "Soltero" | "En una relacion" | "Casado" | "Complicado";
  conflicts_over_social_media: number;
  country:
    | "Afghanistan"
    | "Albania"
    | "Algeria"
    | "Antigua y Barbuda"
    | "Argentina"
    | "Armenia"
    | "Austria"
    | "Bahrain"
    | "Bangladesh"
    | "Belize"
    | "Bhutan"
    | "Bolivia"
    | "Brazil"
    | "Canada"
    | "Chile"
    | "China"
    | "Colombia"
    | "Ecuador"
    | "El salvador"
    | "España"
    | "Estados Unidos"
    | "Germany"
    | "Guatemala"
    | "India"
    | "Italy"
    | "Japan"
    | "Liechtenstein"
    | "Malta"
    | "Mexico"
    | "North Korea"
    | "Peru"
    | "Qatar"
    | "Ukraine"
    | "Venezuela"
    | "Vietnam"
    | "Zimbabue"
    | "Otro";
}
export interface SelectForm{
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
  cluster: number;
  label?: string;
}

export interface ModelVisualizationData {
  title: string;
  type: "bar" | "line" | "pie" | "scatter" | "histogram";
  data: ChartDataPoint[] | ScatterDataPoint[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
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
