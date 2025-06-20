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
  graph: string; // Cambiado de cluster_image a graph
  cluster_assignments?: Record<string, number>; // Opcional para manejar ausencia
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
  plot_image: string;
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
  plot_image: string;
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
    heatmap_image: string;
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
