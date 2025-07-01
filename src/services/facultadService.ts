import { api } from "./api";
import type { Facultad } from "../types";

export const getFacultades = async (): Promise<Facultad[]> => {
  const response = await api.get("/facultad");
  return response.data;
};

export const getFacultadById = async (
  id: string | number
): Promise<Facultad> => {
  const response = await api.get(`/facultad/${id}`);
  return response.data;
};

export const createFacultad = async (
  facultad: Omit<Facultad, "id" | "fechaCreacion" | "activo">
): Promise<Facultad> => {
  const response = await api.post("/facultad", facultad);
  return response.data;
};

export const updateFacultad = async (
  id: string | number,
  facultad: Omit<Facultad, "id" | "fechaCreacion" | "activo">
): Promise<Facultad> => {
  const response = await api.put(`/facultad/${id}`, facultad);
  return response.data;
};

export const deleteFacultad = async (id: string | number): Promise<void> => {
  await api.delete(`/facultad/${id}`);
};
