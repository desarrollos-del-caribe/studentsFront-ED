export interface UserFormData {
  name: string;
  email: string;
  age: number;
  gender: string;
  education_level: string;
  social_media_usage: number;
  main_platform: string;
  sleep_hours_per_night: number;
  relationship_status: string;
  conflicts_over_social_media: number;
  country: string;
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
