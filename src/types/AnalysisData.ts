export interface AgeInfo {
  min_age: number;
  max_age: number;
  invalid_ages: number;
}

export interface AgeValidationResponse {
  data_age: {
    age_info: AgeInfo;
  };
}

export interface CountryInfo {
  valid_countries: number;
  country_counts: Record<string, number>;
}

export interface CountriesResponse {
  data: {
    countries: CountryInfo;
  };
}

export interface NullInfo {
  null_counts: Record<string, number>;
  total_nulls: number;
}

export interface NullInfoResponse {
  data: {
    count: NullInfo;
  };
}

export interface StatisticsData {
  [key: string]: {
    count: number;
    mean: number;
    std: number;
    min: number;
    [key: string]: number;
  };
}

export interface StatisticsResponse {
  data: {
    stats_dict: StatisticsData;
  };
}

export interface OutliersData {
  outliers: number;
}

export interface OutliersResponse {
  data: OutliersData;
}

export interface PlotsData {
  plots: string[];
}

export interface PlotsResponse {
  data: PlotsData;
}

export interface LinearRegressionData {
  coefficients: Record<string, number>;
  intercept: number;
  r2_score: number;
}

export interface LinearRegressionResponse {
  data: {
    linear_regression: LinearRegressionData;
  };
}

export interface LogisticRegressionData {
  coefficients: Record<string, number>;
  intercept: number;
  accuracy: number;
}

export interface LogisticRegressionResponse {
  data: {
    logistic_regression: LogisticRegressionData;
  };
}

export interface CorrelationData {
  [key: string]: Record<string, number>;
}

export interface CorrelationResponse {
  data: {
    correlation_matrix: CorrelationData;
  };
}

export interface DecisionTreeData {
  feature_importance: Record<string, number>;
  accuracy: number;
  tree_image: string;
}

export interface DecisionTreeResponse {
  data: {
    decision_tree: DecisionTreeData;
  };
}

export interface AnovaData {
  f_statistic: number;
  p_value: number;
}

export interface AnovaResponse {
  data: {
    anova: AnovaData;
  };
}