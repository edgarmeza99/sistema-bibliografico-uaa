import { api } from './api';

export const getAutores = async () => {
    const response = await api.get('/autores');
    return response.data;
};

export const getAutorById = async (id) => {
    const response = await api.get(`/autores/${id}`);
    return response.data;
};

export const createAutor = async (autor) => {
    const response = await api.post('/autores', autor);
    return response.data;
};

export const updateAutor = async (id, autor) => {
    const response = await api.put(`/autores/${id}`, autor);
    return response.data;
};

export const deleteAutor = async (id) => {
    await api.delete(`/autores/${id}`);
};