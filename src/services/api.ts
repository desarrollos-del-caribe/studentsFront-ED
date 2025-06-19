import axios from 'axios';
import type  { AnalysisData } from '../types/Analysis';

const API_BASE = 'http://localhost:5000/api';

export const fetchAnalysis = async (): Promise<AnalysisData> => {
  const response = await axios.get(`${API_BASE}/analyze`);
  return response.data;
};
