export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: "Masculino" | "Femenino" | "Otro";
  education_level: "Bachillerato" | "Universidad" | "Posgrado";
  social_media_usage: number; // 1-10 hours per day
  academic_performance: number; // 0-100
  main_platform:
    | "Instagram"
    | "TikTok"
    | "Facebook"
    | "Twitter"
    | "YouTube"
    | "LinkedIn";
  study_hours: number; // hours per week
  created_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
  gender: "Masculino" | "Femenino" | "Otro";
  education_level: "Bachillerato" | "Universidad" | "Posgrado";
  social_media_usage?: number;
  academic_performance?: number;
  main_platform?: string;
  study_hours?: number;
}

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

export interface MLModel {
  id: number;
  name: string;
  algorithm: string;
  description: string;
  accuracy: number;
  use_cases: string;
  use_cases_list: string[];
  is_locked: boolean;
  unlock_condition: string;
  created_at: string;
}

export interface MLAnalysisResult {
  status: "success" | "error";
  model_id: string;
  user_id: string;
  timestamp: string;
  results: {
    accuracy?: number;
    prediction?: number;
    cluster?: number;
    risk_level?: string;
    interpretation: {
      summary: string;
      key_factors: string[];
      recommendations: string[];
      confidence_level: string;
    };
  };
  execution_time?: string;
  error?: string;
}

export interface Visualization {
  type: string;
  title: string;
  data: object;
  insights: string[];
  image_path?: string;
}

export interface ChartData {
  name: string;
  value: number;
  x?: number;
  y?: number;
  label?: string;
}

export interface PredictionResult {
  model: string;
  result: number | string;
  confidence?: number;
  data: ChartData[];
  accuracy?: number;
}

export interface ModelConfig {
  testSize: number;
  randomState: number;
  maxDepth?: number;
  nEstimators?: number;
  clusters?: number;
}
