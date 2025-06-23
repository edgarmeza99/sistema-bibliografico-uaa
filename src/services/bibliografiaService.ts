import type { Bibliografia } from "../types";
import { api } from "./api";

export const getBibliografias = async () => {
  const response = await api.get("/bibliografias");
  return response.data;
};

export const getBibliografiaById = async (id: number | string) => {
  const response = await api.get(`/bibliografias/${id}`);
  return response.data;
};

export const createBibliografia = async (bibliografia: Bibliografia) => {
  const response = await api.post("/bibliografias", bibliografia);
  return response.data;
};

export const updateBibliografia = async (
  id: number | string,
  bibliografia: Bibliografia
) => {
  const response = await api.put(`/bibliografias/${id}`, bibliografia);
  return response.data;
};

export const deleteBibliografia = async (id: number | string) => {
  await api.delete(`/bibliografias/${id}`);
};
