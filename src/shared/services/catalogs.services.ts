import genericRequest from "./api";
import type { SelectForm } from "../types/ml";
const environment = import.meta.env.VITE_ENVIRONMENT;
const BASE_URL =  environment === "production" ? import.meta.env.VITE_API_URL : "http://localhost:5000/api";
const BASE_PATH = '/catalogs';

export const GetCountry = async (): Promise<SelectForm[]> => {
  const response = await genericRequest.GetUrl<SelectForm[]>(`${BASE_URL}${BASE_PATH}/country`);
  return response;
};
export const GetAcademicLevel = async (): Promise<SelectForm[]> => {
  const response = await genericRequest.GetUrl<SelectForm[]>(`${BASE_URL}${BASE_PATH}/academic_level`);
  return response;
};
export const GetGender = async (): Promise<SelectForm[]> => {
  const response = await genericRequest.GetUrl<SelectForm[]>(`${BASE_URL}${BASE_PATH}/gender`);
  return response;
};
export const GetMostUsedPlatform = async (): Promise<SelectForm[]> => {
  const response = await genericRequest.GetUrl<SelectForm[]>(`${BASE_URL}${BASE_PATH}/most_used_platform`);
  return response;
};
export const GetRelationshipStatus = async (): Promise<SelectForm[]> => {
  const response = await genericRequest.GetUrl<SelectForm[]>(`${BASE_URL}${BASE_PATH}/relationship_status`);
  return response;
};