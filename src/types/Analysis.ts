export interface AnalysisData {
  age_info: { min_age: number; max_age: number; invalid_ages: number };
  country_info: { valid_countries: number; country_counts: { [key: string]: number } };
  trimester_info: { outliers: number };
  statistics: { [key: string]: { [key: string]: number } };
  null_info: { null_counts: { [key: string]: number }; total_nulls: number };
  prediction_summary: { [key: string]: number };
  tree_explanation: string;
  cluster_info: { [key: string]: number };
  plots: {
    histogram: string;
    country_plot: string;
    line_plot: string;
    boxplot: string;
    heatmap: string;
    clustering_3d: string;
    decision_tree: string;
    '3d_plot': string;
  };
}
