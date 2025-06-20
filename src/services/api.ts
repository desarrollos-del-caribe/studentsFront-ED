import GenericsRequests from '../api/GenericRequest';
import type {
  AgeValidationResponse,
  CountriesResponse,
  NullInfoResponse,
  StatisticsResponse,
  OutliersResponse,
  PlotsResponse,
  LinearRegressionResponse,
  LogisticRegressionResponse,
  CorrelationResponse,
  DecisionTreeResponse,
  AnovaResponse,
} from '../types/AnalysisData';

export const fetchAgeValidation = async (): Promise<AgeValidationResponse> => {
  const response = await GenericsRequests.Get<AgeValidationResponse>('validate-age');
  return response.data;
};

export const fetchCountries = async (): Promise<CountriesResponse> => {
  const response = await GenericsRequests.Get<CountriesResponse>('validate-countries');
  return response.data;
};

export const fetchNullInfo = async (): Promise<NullInfoResponse> => {
  const response = await GenericsRequests.Get<NullInfoResponse>('null-info');
  return response.data;
};

export const fetchStatistics = async (): Promise<StatisticsResponse> => {
  const response = await GenericsRequests.Get<StatisticsResponse>('statistics');
  return response.data;
};

export const fetchOutliers = async (): Promise<OutliersResponse> => {
  const response = await GenericsRequests.Get<OutliersResponse>('outliers');
  return response.data;
};

export const fetchPlots = async (): Promise<PlotsResponse> => {
  const response = await GenericsRequests.Get<PlotsResponse>('generate-plots');
  return response.data;
};

export const fetchLinearRegression = async (): Promise<LinearRegressionResponse> => {
  const response = await GenericsRequests.Get<LinearRegressionResponse>('linear-regression');
  return response.data;
};

export const fetchLogisticRegression = async (): Promise<LogisticRegressionResponse> => {
  const response = await GenericsRequests.Get<LogisticRegressionResponse>('logistic-regression');
  return response.data;
};

export const fetchCorrelation = async (): Promise<CorrelationResponse> => {
  const response = await GenericsRequests.Get<CorrelationResponse>('correlation');
  return response.data;
};

export const fetchDecisionTree = async (): Promise<DecisionTreeResponse> => {
  const response = await GenericsRequests.Get<DecisionTreeResponse>('decision-tree');
  return response.data;
};

export const fetchAnova = async (): Promise<AnovaResponse> => {
  const response = await GenericsRequests.Get<AnovaResponse>('anova');
  return response.data;
};