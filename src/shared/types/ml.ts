export interface UserFormData {
  name: string;
  email: string;
  age: number;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  education_level: 'Bachillerato' | 'Universidad' | 'Posgrado';
  social_media_usage: number;
  academic_performance: number;
  main_platform: 'Instagram' | 'TikTok' | 'Facebook' | 'Twitter' | 'YouTube' | 'LinkedIn';
  study_hours: number;
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