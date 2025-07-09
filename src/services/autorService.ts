import type { Autor, AutorApiData } from "../types";
import { api } from "./api";

// Función para mapear datos de la API al formato del frontend
const mapApiToAutor = (apiData: any): Autor => {
  return {
    ...apiData,
    fechaNacimiento: apiData.fecha_nacimiento || apiData.fechaNacimiento,
  };
};

export const getAutores = async (): Promise<Autor[]> => {
  const response = await api.get("/autores");
  return response.data.map(mapApiToAutor);
};

export const getAutorById = async (id: number | string): Promise<Autor> => {
  const response = await api.get(`/autores/${id}`);
  return mapApiToAutor(response.data);
};

export const createAutor = async (autor: AutorApiData): Promise<Autor> => {
  const response = await api.post("/autores", autor);
  return mapApiToAutor(response.data);
};

export const updateAutor = async (
  id: number | string,
  autor: AutorApiData
): Promise<Autor> => {
  const response = await api.put(`/autores/${id}`, autor);
  return mapApiToAutor(response.data);
};

export const deleteAutor = async (id: number | string): Promise<void> => {
  await api.delete(`/autores/${id}`);
};
