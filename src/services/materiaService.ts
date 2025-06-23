import { api } from "./api";
import type { Materia } from "../types";

export const getMaterias = async (): Promise<Materia[]> => {
  const response = await api.get("/materias");
  return response.data;
};

export const getMateriaById = async (id: string | number): Promise<Materia> => {
  const response = await api.get(`/materias/${id}`);
  return response.data;
};

export const createMateria = async (
  materia: Omit<Materia, "id" | "fechaCreacion" | "activo" | "facultad">
): Promise<Materia> => {
  const response = await api.post("/materias", materia);
  return response.data;
};

export const updateMateria = async (
  id: string | number,
  materia: Omit<Materia, "id" | "fechaCreacion" | "activo" | "facultad">
): Promise<Materia> => {
  const response = await api.put(`/materias/${id}`, materia);
  return response.data;
};

export const deleteMateria = async (id: string | number): Promise<void> => {
  await api.delete(`/materias/${id}`);
};
