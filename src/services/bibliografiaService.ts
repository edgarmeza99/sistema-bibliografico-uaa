import type { BibliografiaApiData } from "../types";
import { api } from "./api";

export const getBibliografias = async () => {
  const response = await api.get("/bibliografia");
  return response.data;
};

export const getBibliografiaById = async (id: number | string) => {
  const response = await api.get(`/bibliografia/${id}`);
  return response.data;
};

export const createBibliografia = async (bibliografia: BibliografiaApiData) => {
  const response = await api.post("/bibliografia", bibliografia);
  return response.data;
};

export const updateBibliografia = async (
  id: number | string,
  bibliografia: BibliografiaApiData
) => {
  const response = await api.put(`/bibliografia/${id}`, bibliografia);
  return response.data;
};

export const deleteBibliografia = async (id: number | string) => {
  await api.delete(`/bibliografia/${id}`);
};
