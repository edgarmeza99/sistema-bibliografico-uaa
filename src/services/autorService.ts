import type { Autor } from "../types";
import { api } from "./api";

export const getAutores = async () => {
  const response = await api.get("/autores");
  return response.data;
};

export const getAutorById = async (id: number | string): Promise<Autor> => {
  const response = await api.get(`/autores/${id}`);
  return response.data;
};

export const createAutor = async (autor: Autor) => {
  const response = await api.post("/autores", autor);
  return response.data;
};

export const updateAutor = async (id: number | string, autor: Autor) => {
  const response = await api.put(`/autores/${id}`, autor);
  return response.data;
};

export const deleteAutor = async (id: number | string) => {
  await api.delete(`/autores/${id}`);
};
